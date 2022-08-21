//  pentru a folosi module in script scriem   "type": "module",
import express from "express"
import path from "path"
import mongoose from "mongoose"
import dotenv from "dotenv"
import seedRouter from "./routes/seedRoutes.js"
import productRouter from "./routes/productRoutes.js"
import userRouter from "./routes/userRoute.js"
import orderRouter from "./routes/orederRoutes.js"

//pentru a putea aduce variabile din env
dotenv.config()


mongoose.connect(process.env.MONGODB_URL).then(()=>{
  console.log("Database working");
}).catch((err)=>{
  console.log(err.message);
})

const app=express()
//asa transformam data noastra in forma de json pentru a se vedea bine
app.use(express.json())
app.use(express.urlencoded({extended:true}))


//asta este un get api de la paypal si trimitetem  id nostro de la paypal
app.get('/api/keys/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});
//iar aici instantiem ruta create
app.use("/api/seed",seedRouter)  
 
//aici aducem produsele din ruta
app.use("/api/products",productRouter)

app.use("/api/users",userRouter)
 
app.use("/api/orders",orderRouter)

//astea le utilizam pentru a urca sproiectu la heroku
const __dirname=path.resolve()
app.use(express.static(path.join(__dirname, "/frontend/build")))
app.get("*",(req,res)=>
res.sendFile(path.join(__dirname, "/frontend/build/index.html"))
)

 //asa facem sa vedem err.message
app.use((err,req,res,next)=>{
  res.status(500).send({message:err.message})
})

const port =process.env.PORT || 5000

app.listen(port,()=>{
    console.log(`server up on port ${port}`);
})