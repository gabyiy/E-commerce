//aici creem tokenu

import  jwt, { decode } from 'jsonwebtoken';

export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

export const isAuth=(req,res,next)=>{

  //in primu rand luam autorizatia din headers
  const authorization = req.headers.authorization
  if(authorization){
    //daca autorizatia exista salval autorizatia intru token(iar cu slice scotem primele 7 number din token adica BERREAR)
    const token =authorization.slice(7,authorization.length)
    jwt.verify(
      token,process.env.JWT_SECRET,
     (err,decode)=>{
      if(err){
        res.status(401).send({message:"Invalid Token"})
      }else{
        req.user=decode
        next()
      }
     }
    )
  }else {
    res.status(401).send({message:"No Token"})
  }
}
