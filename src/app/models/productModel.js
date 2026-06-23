 import mongoose from "mongoose";

 const productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
     description:{
        type :String,
        required:true
     },
     price:{
        type:String,
        required:true
     },
     image:{
        type:String,
        required:true
     },
     stocks:{
        type:Number,
        default:1
     }
    },{
        timestamps:true
    }
)
const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;