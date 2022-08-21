import React from 'react'
import { Link } from 'react-router-dom'
import Card from "react-bootstrap/Card"
import Button from "react-bootstrap/Button"
import Rating from './Rating'
import { Store } from '../Store'
import axios from "axios"
import { useContext } from 'react'







const Product=({product}) => {

  const { state, dispatch: ctxDispacth } = useContext(Store);
  //din state facem un decostrunct la cart si la cart facem un deconstruct la cartItems
  const {
    cart: { cartItems },
  } = state;

  const addToCartHandler=async(item)=>{

    const existItem= cartItems.find((x)=> x._id===product._id)
//daca existia ar trebui sa creasca cantitatea cu 1 altfel sa o lase 1
const quantity = existItem? existItem.quantity + 1 : 1
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

  return (
    <Card className="product">
    {/* adaugand Link aici spunem sa ne duca la produsu respectiv slug fiind idu, cu ajutoru rutei produsului */}
    {/* iar dupoa ii facem un link care sa ne duca la o ruta cu ce avem scris in slug pentru ca apoi sa o putem accesa cu ajutoru la ref din productScreen */}
    <Link to={`/product/${product.slug}`}>
      <img src={product.image} alt={product.name} className="card-img-top"/>
    </Link>
    <Card.Body>
    <Link to={`/product/${product.slug}`}>
        <Card.Title> 
          <strong>{product.name}</strong>
        </Card.Title>
      </Link>
      <Rating rating={product.rating} numReviews={product.numReviews}/>
      <Card.Text> ${product.price}</Card.Text>
       {product.countInStock===0 ? <Button disabled variant='light'>
        Out of stock
       </Button>:
      <Button onClick={()=>addToCartHandler(product)}>Add to cart</Button>}
    </Card.Body>
    
  </Card>
  )
}

export default Product