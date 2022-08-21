import express from 'express';
import User from '../models/userModel.js';
import expressAsyncHandler from "express-async-handler"
import { isAuth } from '../utils.js';
import Order from '../models/orderModel.js';

const orderRouter = express.Router();

//aici facem ruta de login pentru user folosing expressAsyncHandler(folosim express async pentru a putea accesa errorile din server) si instalandul express-async-handler

// vom folosi is auth pentru a vedea daca useru este autetifacat din utils
orderRouter.post( 
  '/',isAuth,
  expressAsyncHandler(async (req, res) => {
//definim on order dupa modelu Order
const newOreder = new Order({
    //aici facem un map pentru a salava produsu dupa idul lui
    orderItems:req.body.orderItems.map((x)=>({...x,product:x._id})),
    shippingAddress:req.body.shippingAddress,
    paymentMethod:req.body.paymentMethod,
    itemsPrice:req.body.itemsPrice,
    shippingPrice:req.body.shippingPrice,
    taxPrice:req.body.taxPrice,
    totalPrice:req.body.totalPrice,
    user:req.user._id,

})
//creem un nou order si dupa trimitem statusu 201 cu mesaju si orderu creat
const order = await newOreder.save()
res.status(201).send({message:"New Order Created",order})
}))



//asa returnam orders ale userului curent
orderRouter.get(
  '/mine',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.send(orders);
  })
);

//asa facem un root la produs de forma dinamica in functie de id
orderRouter.get( 
  '/:id',isAuth,
  expressAsyncHandler(async (req, res) => {
//asa spunem sa ne gaseasca produs dupa id   
const order = await Order.findById(req.params.id)
if(order){
  res.send(order)
}else{
  res.status(404).send({message:"Order Not Found"})
}


}))

orderRouter.put(
  '/:id/pay',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "email name"
    );
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResut = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };
      const updatedOrder = await order.save();
      res.send({ message: 'Order Paid', order: updatedOrder });
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);
export default orderRouter;

