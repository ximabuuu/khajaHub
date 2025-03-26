import mongoose from "mongoose";

const productSchema =new mongoose.Schema({
    name : {
        type : String,
    },
    image : {
        type : Array,
        default : []
    },
    category : [
        {
            type : mongoose.Schema.ObjectId,
            ref : 'category'
        }
    ],
    subCategory : [
        {
            type : mongoose.Schema.ObjectId,
            ref : 'subCategory'
        }
    ],
    restaurant : [
        {
            type : mongoose.Schema.ObjectId,
            ref : 'restaurant'
        }
    ],
    user : [
        {
            type : mongoose.Schema.ObjectId,
            ref : 'user'
        }
    ],
    reviews: [
        { 
            type: mongoose.Schema.ObjectId, 
            ref: "review" 
        }
    ],
    averageRating: { 
        type: Number, 
        default: 0 
    },
    unit : {
        type : String,
        default : ""
    },
    price : {
        type : Number,
        default : null
    },
    discount : {
        type : Number,
        default : null
    },
    description : {
        type : String,
        default : ""
    },
    more_details : {
        type : Object,
        default : {}
    },
    publish : {
        type : Boolean,
        default : true
    }
},{
    timestamps : true
})

productSchema.index({
    name : "text",
    description : "text"
},{
    name : 10,
    description : 5 
})

const ProductModel = mongoose.model("product",productSchema)

export default ProductModel