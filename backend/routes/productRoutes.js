import express from "express"
import Product from "../models/productModel.js"
import expressAsyncHandler from "express-async-handler"

const productRouter=express.Router()


//aici am facut o ruta ca sa trimitem la front toate produse din PRoduct
productRouter.get("/",async (req,res)=>{
    const products = await Product.find()
    res.send(products)
} )

productRouter.get("/categories",expressAsyncHandler(async(req,res)=>{
  // cu distinct spunem sa ne arate toate categorile dar doar cele unice si nu dublurile
  const categories = await Product.find().distinct("category")
  res.send(categories)
}) )

//asa creem ruta pentru a vedea de forma dinamica productul selectionat
productRouter.get("/slug/:slug",async (req,res)=>{
    const product =  await Product.findOne({slug :req.params.slug})
    if(product){
      res.send(product)
    }else{
      res.status(404).send({message:"Product not found"})
    }
   })
   
  //aici facem un api pentru a verifica produsul dupoa id si a vedea daca mai sunt disponibile
  productRouter.get("/:id",async(req,res)=>{
    const product = await Product.findById(req.params.id)
    if(product){
      res.send(product)
    }else{
      res.status(404).send({message:"Product not found"})
    }
   })

export default productRouter