import express  from "express"
import data from "../data.js"
import Product from "../models/productModel.js"
import User from "../models/userModel.js"

const seedRouter= express.Router()


//aici am creat o ruta 
seedRouter.get("/",async(req ,res)=>{
    //si aici stergem toate datele care le aveam salvate in in Product model
    await Product.deleteMany({})
    await User.deleteMany({})
    //iar apoi vom crea produse noi cu ce avem in data
    const createdProducts = await Product.insertMany(data.products)
    //iar aici adaugam niste utilizatoori pe default
    const createdUsers = await User.insertMany(data.users)
    res.send({createdUsers,createdProducts})

})


export default seedRouter