import React, { useContext, useEffect, useReducer } from 'react';
import Card from 'react-bootstrap/esm/Card';
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import CheckoutSteps from '../components/CheckoutSetup';
import { Store } from '../Store';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/esm/Button';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import Axios from 'axios';
import LoadingBox from "../components/LoadingBox"

//aic idefinim reduceru

const reducer = (state, action) => {
  switch (action.type) {
    //primu case va fi imediat ce trimite requestu pri axios(si returnam state deja existent si schimbam loadingu in true)
    case 'CREATE_REQUEST':
      return { ...state, loading: true };
    case 'CREATE_SUCCESS':
      return { ...state, loading: false };
    case 'CREATE_FAIL':
      return { ...state, loading: false };
    default:
      return state;
  }
};

const PlaceOrderScreen = () => {
  const navigate = useNavigate();

  //definim useReduceru,aici numai luam data ci ceva mai specific ca loading si error
  const [{ loading}, dispatch] = useReducer(reducer, {
    loading: false,
 
  });

  //iar aici aducem userInfo si cart din store
  const { state, dispatch: ctxDispatch } = useContext(Store);

  const { cart, userInfo } = state;

  //facem un numar care sa aibe maxim 2 decimale il vom folosi sa calculam item price
  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; // 123.2345 => 123.23
  cart.itemsPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );
  cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10);
  cart.taxPrice = round2(0.15 * cart.itemsPrice);
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

  //vom folosi functia asta sa trimite informatia in backend
  const placeOrderHandler = async () => {
    try {
      //aici folosim dispacheru ca sa trimite create_request care activeaza loadingu in true
      dispatch({ type: 'CREATE_REQUEST' });

      //iar  aici trimitem data care o avem dinsponibila din store, adica ce avem salvat in cart
      const { data } = await Axios.post(
        '/api/orders',
        {
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice,
        },
        //si aici trimite si tokenu useeruluio
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      //dupa ce am trimis datele golim cariucuiru cu dipaceru selectionand caee cart_clear,golim storegu loca
      ctxDispatch({type:"CART_CLEAR"})
      dispatch({type:"CREATE_SUCCESS"})
      localStorage.removeItem("cartItems")
      //si aici cu navigate il trimitem pe user la order detail page

      navigate(`/order/${data.order._id}`)

      //in caz ca avem erroare trimitem cu dipacheru case Create fail si folosim toast sa aducem erroare diun back
    } catch (err) {
      dispatch({ type: 'CREATE_FAIL' });
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart, navigate]);
  return (
    //iar adaugam checkout steps pentru  a vedea unde suntem
    <div>
      <CheckoutSteps step1 step2 step3 step4>
        {' '}
      </CheckoutSteps>
      <Helmet>
        <title>Preview Order</title>
      </Helmet>
      <h1 className="my-3"> Preview Order</h1>
      <Row>
        {/* coloana contine 8 spati din 12 */}
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Shipping</Card.Title>
              <Card.Text>
                {/* aici accesam toate date din store care a introdus useru */}
                <strong>Name:</strong>
                {cart.shippingAddress.fullName}
                <br />
                <strong>Adress:</strong>
                {cart.shippingAddress.address},{cart.shippingAddress.city},
                {cart.shippingAddress.postalCode},{cart.shippingAddress.country}
              </Card.Text>
              {/* si cu linku asta redirectionam catre shipping in caz ca doreste sa schimbe adresa */}
              <Link to="/shipping">Edit</Link>
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Payment</Card.Title>
              <Card.Text>
                {' '}
                <strong>Method:</strong>
                {cart.paymentMethod}
              </Card.Text>
              <Link to="/payment">Edit</Link>
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Items</Card.Title>
              <ListGroup variant="flush">
                {cart.cartItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded img-thumbnail"
                        ></img>{' '}
                        <Link to={`/product/${item.slug}`}>{item.name}</Link>
                      </Col>
                      <Col md={3}>
                        <span>{item.quantity}</span>
                      </Col>
                      <Col md={3}>${item.price}</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Link to="/cart">Edit</Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Order Simmary</Card.Title>
              <ListGroup variant="flush">
                <Row>
                  <Col>Items</Col>
                  <Col>${cart.itemsPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup>
              <ListGroup>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${cart.shippingPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup>
              <ListGroup variant="flush">
                <Row>
                  <Col>Tax</Col>
                  <Col>${cart.taxPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup>
              <ListGroup variant="flush">
                <Row>
                  <Col>Order Total</Col>
                  <Col>${cart.totalPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup>
              <ListGroup.Item>
                <div className="d-grid">
                  <Button
                    type="button"
                    onClick={placeOrderHandler}
                    disabled={cart.itemsPrice.length === 0}
                  >
                    {' '}
                    Place Order
                  </Button>
                 
                </div>
                {/* aici cand suntem in loading adica in create request sa ne arate loading */}
                {loading &&  <LoadingBox></LoadingBox>}

              </ListGroup.Item>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PlaceOrderScreen;
