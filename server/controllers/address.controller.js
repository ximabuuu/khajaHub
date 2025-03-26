import AddressModel from "../models/address.model.js"
import UserModel from "../models/user.model.js"


export const addAddressController = async (req, res) => {
    try {

        const userId = req.userId

        const { address_line, city, Province, pincode, country, mobile } = req.body

        const addAddress = new AddressModel({
            address_line,
            city,
            country,
            Province,
            pincode,
            mobile,
            userId: userId
        })

        const saveAddress = await addAddress.save()

        const addUserAddress = await UserModel.findByIdAndUpdate(userId, {
            $push: {
                address_details: saveAddress._id
            }
        })

        return res.json({
            message: "Address added Successfully.",
            error: false,
            success: true,
            data: saveAddress
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}


export const getAddressController = async (req, res) => {
    try {
        const userId = req.userId

        const data = await AddressModel.find({ userId: userId }).sort({ createdAt: -1 })

        return res.json({
            data: data,
            message: "List of Address",
            success: true,
            error: false
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}


export const updateAddressController = async (req, res) => {
    try {
        const userId = req.userId

        const { _id, address_line, city, country, Province, mobile, pincode } = req.body

        const updateAddress = await AddressModel.updateOne({_id : _id, userId : userId},{
            address_line,
            city,
            country,
            Province,
            pincode,
            mobile
        })

        return res.json({
            message : "Address updated Successfully",
            error : false,
            success : true,
            data : updateAddress
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}


export const deleteAddressController = async (req,res) => {
    try {
        const userId = req.userId
        const {_id} = req.body
        const disableAddress = await AddressModel.updateOne({_id : _id, userId : userId},{
            status : false
        })

        return res.json({
            message : "Address removed successfully",
            error : false,
            success : true,
            data : disableAddress
        })

    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}