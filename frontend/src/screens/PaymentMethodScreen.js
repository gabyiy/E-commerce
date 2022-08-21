import React, { useContext, useEffect, useState } from 'react'
import Button from 'react-bootstrap/esm/Button'
import Form from 'react-bootstrap/Form'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import CheckoutSteps from "../components/CheckoutSetup"
import { Store } from '../Store'

const PaymentMethodScreen = () => {

    const navigate=useNavigate()
    //aducem din store ce avem nevoie cu use context din state luam cart si din cart shiping si payment
    const {state,dispatch:ctxDispacth}=useContext(Store)
    const {
        cart:{
            shippingAddress,paymentMethod
        },
    }=state

    const [paymentMethodName,setPaymentMethod]=useState(paymentMethod || "PayPal")



    //iar in use efect facem logica daca shipping address nu exista sa ne redirectioneze la shipping
useEffect(()=>{
if(!shippingAddress.address){
    navigate("/shipping")
}
},[shippingAddress,navigate])

    const submitHandler=(e)=>{
        e.preventDefault()
        //iar aici cu dispacheru trimit la store in save_payment_method payloadu,care vbine de la ce a dat click useru
        ctxDispacth({type:"SAVE_PAYMENT_METHOD",payload:paymentMethodName})

        //si aici salvam si in storu local al pagini web si dupa ii facem un redirect la urmatoarea ruta
        localStorage.setItem("paymentMethod",paymentMethodName)
         navigate("/placeorder")
    }

  return (
    //inplemementam componentu schechout steps pentru a implementa bara de sus si a vedea in ce poziti a ajuns useru
    <div>
        <CheckoutSteps step1 step2 step3></CheckoutSteps>
        <div className='container small-container'>
            {/* iar aici adaugam headingu cu helmet si numele */}
        <Helmet>
            <title>Payment Method</title>
        </Helmet>
        <h1 className='my-3'>Payment Method</h1>
        <Form onSubmit={submitHandler}>
        {/* facem doua checkboxuri unu pentru paypal si stripe */}
        <div className='mb-3'>
<Form.Check type="radio" id="PayPal" label="PayPal" value="PayPal" checked= {paymentMethodName ==="PayPal"} onChange={(e)=>setPaymentMethod(e.target.value)}>

</Form.Check>
</div>
<div className='mb-3'>
<Form.Check type="radio" id="Stripe" label="Stripe" value="Stripe" checked= {paymentMethodName ==="Stripe"} onChange={(e)=>setPaymentMethod(e.target.value)}>

</Form.Check>
</div>
<Button type='submit'>Continue</Button>
        </Form>
        </div>
    </div>
  )
}

export default PaymentMethodScreen