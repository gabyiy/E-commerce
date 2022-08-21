import React, { useContext, useEffect, useReducer } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ListGroup from 'react-bootstrap/ListGroup';
import Rating from '../components/Rating';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import {Helmet} from "react-helmet-async"
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils';
import { Store } from '../Store';

const reducer = (state, action) => {
  //facem un swich unde comparam cele trei cazuri de actiuni
  switch (action.type) {
    //primu est fech care se activeaza cand trimitem un request la back
    case 'FETCH_REQUEST':
      //si face un return la state unde pastam statu anterior, si setam loading to true penmtru a seta un loading box in ui
      return { ...state, loading: true };
    //in caz ca fechu a avut succes pastrama datele anterioare din state si updatam products doar cu ce primim de la action.payload si lading to false ca am primit datele
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };
    //in caz ca ne da fail ramane statu anterioor setam loader to false si err ce primin de la action payload
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    //daca nu primim nici o informatie care se refera la cele 3 staturi returnam curent state
    default:
      return state;
  }
};

const ProductScreen = () => {
const navigate= useNavigate()

  // pentru a lua slug(care vine din data) de forma din amica vom folosi use paramas
  const params = useParams();
  const { slug } = params;

  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    //aici le setam valorile defaul
    loading: true,
    error: '',
    product: [],
  });

  useEffect(() => {
    const fechData = async () => {
      //asa setam loading to true cu dispach ,accesand prima optiiune din switch
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        //asa accesam de forma dinamica datele de la slug
        const result = await axios.get(`/api/products/slug/${slug}`);
        //daca totu merge bine activam dispoch FETCH_SUCCESS si ca payload ii trimite result.data
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        //iar aici daca avem o erroare folosim dispach fetch_fail si la payload erroarea
        //si eroarea o bagam in functia getError
        dispatch({ type: 'FETCH_FAIL', payload:getError( err )});
      }
    };
    fechData();
  }, [slug]);

//definim state curent la context si dispach ca sa putem schimba stateu, dispachu ii schimbam numele in ctxDispacth si spunem ca vrem sa fie egal cu useContext pentru a avea schimba state
//iar in useContext specificam unde vrem sa trimitem datele
const {state,dispatch:ctxDispacth}=useContext(Store)
//scoatem cart din state
const {cart}=state

  const addToCartHandler= async()=>{
    //iar asa verificam daca exista deja acel produs(dupa id)
const existItem= cart.cartItems.find((x)=> x._id===product._id)
//daca existia ar trebui sa creasca cantitatea cu 1 altfel sa o lase 1
const quantity = existItem? existItem.quantity + 1 : 1

//iar aici facem un request la api produsulkui sa fim siguri ca stocku lui nu este mai mic decat 1
const { data } = await axios.get(`/api/products/${product._id}`);

//aici spunem daca  catitate produsului este mai mica ca 1 sa spuna ca nu ma este disponibila
if (data.countInStock<quantity){
window.alert("Sorry. Product is out of stock")
return              
}
    //iar aici utilizam dispacheru pentru a trimite datele store
    //ca payload spunem ca vrem sa trimitem product si quantity 
ctxDispacth({type:"CART_ADD_ITEM",payload:{...product,quantity}})

//pentru a redirectiona useru la cart  folosim
navigate('/cart')
  }
  return loading ? (
    //acest component o sa ne arate un spinner de loading
   
    <LoadingBox />
  ) : error ? (
    //componentu asta ne arata diferite messaje
    <MessageBox variant="danger">{error}</MessageBox>): (
    <div>
      <Row>
        <Col md={6}>
          <img className="img-large" src={product.image} alt={product.name} />
        </Col>
        <Col md={3}>
          {/* pentru adauga mai multe iteme utilizam listGroup si clasa flush pentru ai scoate border */}
          <ListGroup variant="flush">
            <ListGroup.Item>
            {/* utilizam helmet pentru a vedea numele produsului in parte de sus a ecranului */}
          <Helmet><title>{product.name}</title></Helmet>
              <h1>{product.name}</h1>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating
                rating={product.rating}
                numReviews={product.numReviews}
              ></Rating>
            </ListGroup.Item>
            <ListGroup.Item>Price : ${product.price}</ListGroup.Item>
            <ListGroup.Item>
              Description:
              <p>{product.description}</p>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col>${product.price}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    {/* aici facem logica pentru a vedea daca produsu este disponibil */}
                    <Col>
                      $
                      {product.countInStock > 0 ? (
                        <Badge bg="success">In Stock</Badge>
                      ) : (
                        <Badge bg="danger">Unavailable</Badge>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>
                {/* iar aici facem o alta condite (in caza ca avem produsu in sock sa ne arate divu cu add to cart) */}
                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <div className="d-grid">
                    {/* aici cu butonu activam functia addToCarthandler care va addauga la cart */}
                      <Button variant="primary" onClick={addToCartHandler}>Add to Cart</Button>
                    </div>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProductScreen;
