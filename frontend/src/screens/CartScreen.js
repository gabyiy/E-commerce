import React, { useContext } from 'react';
import Col from 'react-bootstrap/esm/Col';
import ListGroup from 'react-bootstrap/ListGroup';

import ListGroupItem from 'react-bootstrap/esm/ListGroupItem';
import Row from 'react-bootstrap/esm/Row';
import { Helmet } from 'react-helmet-async';
import { Link,useNavigate } from 'react-router-dom';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import Button from 'react-bootstrap/esm/Button';
import Card from 'react-bootstrap/Card';
import axios from "axios"

const CartScreen = () => {
  const navigate= useNavigate()


  //facem un acces la sotre
  const { state, dispatch: ctxDispacth } = useContext(Store);
  //din state facem un decostrunct la cart si la cart facem un deconstruct la cartItems
  const {
    cart: { cartItems },
  } = state;

  //aici creem functia de la butoane care adaugam sau scoatem un item

  const updateCartHandler=async(item,quantity)=>{
const {data}= await axios.get(`/api/products/${item._id}`)
if (data.countInStock<quantity){
  window.alert("Sorry. Product is out of stock")
  return              
  }
      //iar aici utilizam dispacheru pentru a trimite datele store
      //ca payload spunem ca vrem sa trimitem product si quantity 
  ctxDispacth({type:"CART_ADD_ITEM",payload:{...item,quantity}})
  
  //pentru a redirectiona useru la cart  folosim
 
  }

  const removeItemHandler=(item)=>{
    ctxDispacth({type:"CART_REMOVE_ITEM",payload:item})
  }

  //cu functia asta verificam daca utilizatoru este autentificat il rfedirectionam la sheeping screen
   const checkoutHandler=()=>{
    navigate("/signin?redirect=/shipping")
   }
  return (
    <div>
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      <h1>Shopping cart</h1>
      <Row>
        <Col md={8}>
          {/* aici acesam cartitems si spunem daca caritems este mai mic ca 0 sa ne arate urmatoarele alftrel sa ne arate lit of items */}
          {cartItems.length === 0 ? (
            <MessageBox>
              Cart is empty. <Link to="/">Go Shopping</Link>
            </MessageBox>
          ) : (
            <ListGroup>
              {cartItems.map((item) => (
                <ListGroupItem key={item._id}>
                  <Row className="align-items-center">
                    <Col md={4}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="img-fluid rounded img-thumbnail"
                      />{' '}
                      <Link to={`/product/${item.slug}`}>{item.name}</Link>
                    </Col>
                    <Col md={3}>
                    {/* iar aici scoatem 1 item care  care dorim cuj functia */}
                      <Button variant="light" onClick={()=>updateCartHandler(item,item.quantity -1)}
                      
                       disabled={item.quantity === 1}>
                        <i className="fas fa-minus-circle"></i>
                      </Button>{' '}
                      <span>{item.quantity}</span>{' '}
                    {/* la butonu asta ii adaugam o funcite care sa ne adauge 1 produs la cart  ,functia are 2 parametri itemu care vrem sa il updata msi al doilea este quantetiu*/}
                      <Button
                        variant="light" onClick={()=>updateCartHandler(item,item.quantity +1)}
                        disabled={item.quantity === item.countInStock}
                      >
                        <i className="fas fa-plus-circle"></i>
                      </Button>{' '}
                    </Col>
                    <Col md={3}>${item.price}</Col>
                    <Col md={2}>
                      <Button variant="light" onClick={()=>removeItemHandler(item)} >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroupItem>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  {/* aici facem logica pentru a vedea cate iteme avem si care este pretu */}
                  <h3>
                    Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}
                    items) : $
                    {cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}
                  </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      variant="primary"
                      onClick={()=>checkoutHandler()}
                      disabled={cartItems.length === 0}
                    >
                      Proceed to checout
                    </Button>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CartScreen;
