import React, { useContext, useReducer, useState } from 'react';
import { Store } from '../Store.js';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';

import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import { getError } from '../utils.js';
import axios from 'axios';

const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'FETCH_FAIL':
      return { ...state, loadingUpdate: false };
    default:
      return state;
  }
};

//acest screen il folosim pentru a udata profilu userului
const ProfileScreen = () => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const [name, setName] = useState(userInfo.name);
  const [email, setEmail] = useState(userInfo.email);
  const [password, setPassword] = useState(userInfo.password);
  const [confirmPassword, setConfirmPassword] = useState('');

  //aici folosim useReducer pentru a ne reseta useru si a adauga un loading

  const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
    loadingUpdate: false,
  });

  //iar aici trimitem requestu ajax catre backend
  const sumbitHandler = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.put('/api/users/profile',{name,email,password},{headers:{Authorization:`Bearer ${userInfo.token}`}});
      dispatch({type:"UPDATE_SUCCESS"})

      //iar data totu sa realizat cu succes utilizizam ctx dispach pentru a salava in store la `userSigin noile credentiale 
      ctxDispatch({type:"USER_SIGNIN",payload:data})
      localStorage.setItem("userInfo",JSON.stringify(data))
      toast.success("User updated successfully")
    } catch (err) {
      dispatch({ type: 'FETCH_FAIL' });
      toast.error(getError(err));
    }
  };
  return (
    <div className=" container small-container">
      <Helmet>
        <title>User Profile</title>
      </Helmet>
      <h1 className="my-3">User Profile</h1>
      <form onSubmit={sumbitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label> Name </Form.Label>
          <Form.Control
            vlaue={name}
            onChange={(e) => setName(e.target.value)}
            required
          ></Form.Control>
        </Form.Group>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label> Email </Form.Label>
          <Form.Control
            vlaue={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          ></Form.Control>
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label> Password </Form.Label>
          <Form.Control
            vlaue={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          ></Form.Control>
        </Form.Group>
        <Form.Group className="mb-3" controlId="confirmPassword">
          <Form.Label> ConfirmPassword </Form.Label>
          <Form.Control
            vlaue={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <div>
          <Button type="submit"> Update </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileScreen;
