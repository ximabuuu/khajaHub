import mongoose from "mongoose";

const popupSchema = new mongoose.Schema({
    imageUrl : {
        type : String,
        required : true
    }
})

const PopupModel = mongoose.model("popup",popupSchema)
export default PopupModel