import mongoose from "mongoose";

const cartProductSchema = new mongoose.Schema({
    productId : {
        type : mongoose.Schema.ObjectId,
        ref : 'product'
    },
    quantity : {
        type : Number,
        default : 1
    },
    userId : {
        type : mongoose.Schema.ObjectId,
        ref : 'User'
    },
    restaurant: {
        type: String
    }
    
},{
    timestamps : true
})

const cartProductModel = mongoose.model("cartProduct",cartProductSchema)

export default cartProductModel