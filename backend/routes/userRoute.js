import expres from 'express';
import User from '../models/userModel.js';
import bcrypt from "bcryptjs"
import expressAsyncHandler from "express-async-handler"
import { generateToken, isAuth } from '../utils.js';

const userRouter = expres.Router();

//aici facem ruta de login pentru user folosing expressAsyncHandler(folosim express async pentru a putea accesa errorile din server) si instalandul express-async-handler
userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
const user =await User.findOne({email:req.body.email})

//daca exista useru sau passu sa ne dea inpoi datele uiserelui 
if(user){
    if(bcrypt.compareSync(req.body.password,user.password)){
res.send({
    _id:user._id,
    name:user.name,
    email:user.email,
    isAdmin:user.isAdmin,
    //iar aici creem token cu ajutoru ce avem in utility
    token:generateToken(user)
})
return
    }
}
//daca datele nu concid email sau passu sa dea messaju
res.status(401).send({message:"Invalid email or password"})

  })
);

//aici creem ruta pentru sign in unde practgic creem un nou user
userRouter.post("/signup",expressAsyncHandler(async(req,res)=>{

  const newUser = new User({
    name:req.body.name,
    email:req.body.email,
    password:bcrypt.hashSync(req.body.password)
  })
  const user = await newUser.save()

  res.send({
    _id:user._id,
    name:user.name,
    email:user.email,
    isAdmin:user.isAdmin,
    //iar aici creem token cu ajutoru ce avem in utility
    token:generateToken(user)
})
  
}))


//ruta asta o utiulizam pentru a shimba datele userului din ProfileScreen
userRouter.put("/profile",isAuth,expressAsyncHandler(async(req,res)=>{
const user = await User.findById(req.user._id)
//aici spunem daca nu avem nimic introdus la req.body.username sa salveze datele anterioare
if(user){
  user.name = req.body.name || user.name
  user.email=req.body.email || user.email
  //iar aici facem daca a introdus ceva la parola sa ne schimba paroloa cu cea introdusa
  if(req.body.password){
    user.password= bcrypt.hashSync(req.body.password,8)
  
}
//aici salvam useru si sa trimitem datele catre front
const updatedUser = await user.save()

res.send({
_id:updatedUser._id,
name:updatedUser.name,
email:updatedUser.email,
isAdmin:updatedUser.isAdmin,
token:generateToken(updatedUser)
})

}else{
  res.status(404).send({message:"User not found"})
}
}))

export default userRouter;
