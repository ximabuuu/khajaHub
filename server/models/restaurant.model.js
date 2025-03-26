import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
    name : {
        type : String,
        default : ""
    }
})

const RestaurantModel = mongoose.model("restaurant",restaurantSchema)
export default RestaurantModel