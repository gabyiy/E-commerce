import React, { useEffect, useReducer, useState } from 'react';
import { Link } from 'react-router-dom';
//import data from '../data'
import axios from 'axios';
       import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Product from '../components/Product';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

//reduceri accepta 2 parametri, prim ueste statu curent, al doilea este action care creaza un nou state*(poate modifica statul inital)
const reducer = (state, action) => {
  //facem un swich unde comparam cele trei cazuri de actiuni
  switch (action.type) {
    //primu est fech care se activeaza cand trimitem un request la back
    case 'FETCH_REQUEST':
      //si face un return la state unde pastam statu anterior, si setam loading to true penmtru a seta un loading box in ui
      return { ...state, loading: true };
    //in caz ca fechu a avut succes pastrama datele anterioare din state si updatam products doar cu ce primim de la action.payload si lading to false ca am primit datele
    case 'FETCH_SUCCESS':
      return { ...state, products: action.payload, loading: false };
    //in caz ca ne da fail ramane statu anterioor setam loader to false si err ce primin de la action payload
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    //daca nu primim nici o informatie care se refera la cele 3 staturi returnam curent state
    default:
      return state;
  }
};

const HomeScreen = () => {
  //pentru a salva produsele din back utilizam useState
  // const [products,setProducts]=useState([])

  //acu vom folosi reduceru creat,acesta contien loading error productsi un dispacher, care va updata statu
  //useReduceru accepta 2 parametri, 1 estre reduceru creat iar al doilea este un defaul state
  //initial
  //loggeru se utilizaza mai mult ca debuger
  const [{ loading, error, products }, dispach] = useReducer(reducer, {
    //aici le setam valorile defaul
    loading: true,
    error: '',
    products: [],
  });

  //ia asa aducem data din back de la ap creat acolo
  useEffect(() => {
    const fechData = async () => {
      //asa setam loading to true cu dispach ,accesand prima optiiune din switch
      dispach({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('/api/products');
        //daca totu merge bine activam dispoch FETCH_SUCCESS si ca payload ii trimite result.data
        dispach({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        //iar aici daca avem o erroare folosim dispach fetch_fail si la payload erroarea
        dispach({ type: 'FETCH_FAIL', payload: err.message });
      }

      // setProducts(result.data)
    };
    fechData();
  }, []);
  return (
    <div>
      {/* aici folosim iar helet si spunem cand suntem la pagina home sa ne arate numele paginei */}
      <Helmet>
        <title>Amazona</title>
      </Helmet>
      <h1>Featured Products</h1>
      <div className="products">
        {/* iar aici facem logica in caz ca avem loading sa ne arate divu cu loading, sau error, ori 
      products */}
        {loading ? (
          //acest component o sa ne arate un spinner de loading
          <LoadingBox />
        ) : error ? (
          //componentu asta ne arata diferite messaje
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          //aici vom utiliza  sitemu row and cols din bootstrap
          <Row>
            {products.map((product) => (
              <Col sm={6} md={4} lg={3} className="mb-3" key={product.slug}>
                {/* aici trimitem product la component */}
                <Product product={product} />
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
};

export default HomeScreen;
