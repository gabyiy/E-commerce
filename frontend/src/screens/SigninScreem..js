import React, { useContext, useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';

import Button from 'react-bootstrap/esm/Button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import  axios  from 'axios';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils';

const SigninScreen = () => {
  //aici definim staturil la passowrd si email
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

//iar cu navigatge redirectionam userul
const navigate=useNavigate()


  //scoate search din use location apoi crem un redirectURL care o sa fie slash shiping din linkul create acount, si spunem daca acesta exista sa il setezi in redirect altfe sa puna home
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

//pentru a salva useru in store creem urmatoare const
const{state,dispatch:ctxDispatch}=useContext(Store)

const {userInfo}=state



  //aici creem functia de la form care o sa trimita datele introduse in form in backend cu un post
  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post('/api/users/signin', {
        // aici spunem ca o sa trimitem email si passwordu la api de mai sus si primim un response dar inloc de response vrem sa extragem data
        email,
        password,
      });
      //iar aici cu dispatch trimite in Store,type find user_Signin si payloadu va fi ce primim din back adica data
      ctxDispatch({type:"USER_SIGNIN",payload:data})
      //iar aici salvam datele usrului in breoser
      localStorage.setItem("userInfo",JSON.stringify(data))
      //iar aici il trimite la home(cu navigate putem trimite la ce rute dorim)
      navigate(redirect||"/")
    } catch (err) {
   //iar aici  folosim toastify importat in app.js, si cu getError aducem ce avem la err din backend
   toast.error(getError(err))

    }
  };

  //folosim useefectu asta pentru ca in caza ca suntem logati sa numai putem accesa pagina cu signIn

  useEffect(()=>{
    if(userInfo){
      navigate(redirect)
    }
  },[navigate,redirect,userInfo])
  return (
    <Container className="small-container">
      <Helmet>
        <title>Sign In</title>
      </Helmet>
      <h1 className="my-3">Sign In</h1>
      {/* aici creem un formular si trecem on submit pentru a salva datele introduse in formulare */}

      <Form onSubmit={submitHandler}>
        {/* asa grupam label si cu formControl input  ,iar dupa cu onChange setam email */}
        <Form.Group
          className="mb-3"
          controlId="email"
        
        >
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" requierd    onChange={(e) => setEmail(e.target.value)}/>
        </Form.Group>
        <Form.Group
          className="mb-3"
          controlId="passowrd"
        
        >
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" requierd   onChange={(e) => setPassword(e.target.value)}/>
        </Form.Group>
        <div className="mb-3">
          <Button type='submit'>Sign In</Button>
        </div>
        {/* aici facem un link pentru new customer si o sa il redirictionam spre register */}
        <div className="mb-3">
          New customer?{' '}
          <Link to={`/signup?redirect=${redirect}`}>Create your account</Link>
        </div>
      </Form>
    </Container>
  );
};

export default SigninScreen;
