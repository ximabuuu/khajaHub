import ProductModel from "../models/product.model.js"
import RestaurantModel from "../models/restaurant.model.js"

//adding restro
export async function addRestaurant(req,res) {
    try {
        const {name,address} = req.body
        const newRestaurant = new RestaurantModel({name,address})
        await newRestaurant.save()
        res.status(201).json({
            success : true,
            message: "Restaurant added successfully", newRestaurant 
        })
    } catch (error) {
        res.status(500).json({ message: "Error adding restaurant", error })
    }
}

//getting restro
export const getRestaurantController =async (req,res)=>{
    try {
        
        const data = await RestaurantModel.find()

        return res.json({
            data : data,
            error : false,
            success : true
        })

    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export const updateRestaurantController = async (req,res) => {
    try {
        const {_id,name,address} = req.body

        const update = await RestaurantModel.updateOne({
            _id : _id
        },{
            name,address
        })

        return res.json({
            message : "Restaurant Updated Successfully.",
            success : true,
            error : false,
            data : update
        })

    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export const deleteRestaurantController = async (req,res) => {
    try {
        const { _id } = req.body

    
        const checkProduct = await ProductModel.find({
            restaurant : {
                "$in" : [_id]
            }
        }).countDocuments()

        if( checkProduct > 0){
            return res.status(400).json({
                message : "This Restaurant is in use.",
                error : true,
                success : false
            })
        }

        const deleteRestaurant = await RestaurantModel.deleteOne({_id : _id})

        return res.json({
            message : "Restaurant deleted Successfully",
            data : deleteRestaurant,
            error : false,
            success : true

        })

    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            Success : false
        })
    }
}