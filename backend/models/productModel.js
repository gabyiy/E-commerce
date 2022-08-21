import mongoose from "mongoose"

const productSchema = new mongoose.Schema(
    {
        name:{type:String, required:true, unique:true},
        slug:{type:String, required:true, unique:true},
        image:{type:String,required:true},
        brand:{type:String,required:true},
        category:{type:String,required:true},
        description:{type:String,requiered:true},
        price:{type:Number,required:true},
        countInStock:{type:Number,required:true},
        rating:{type:Number,required:true},
        numReviews:{type:Number,requiered:true}
    },
    // aici o sa adaugam al doilea parametru la schema
    {
    timestamps :true
    }
)
const Product = mongoose.model("Product",productSchema)

export default Product