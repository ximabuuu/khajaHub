import mongoose from "mongoose"
import OrderModel from "../models/order.model.js"
import cartProductModel from "../models/cartProduct.model.js"
import UserModel from "../models/user.model.js"


export const CashOnDelivery = async (req, res) => {
    try {

        const userId = req.userId
        const { list_items, totalAmt, addressId, totalQty } = req.body

        const payload = list_items.map(el => {
            return ({

                userId: userId,
                orderId: `ORD-${new mongoose.Types.ObjectId()}`,
                productId: el.productId._id,
                product_details: {
                    name: el.productId.name,
                    image: el.productId.image
                },
                paymentId: "",
                payment_status: "CASH ON DELIVERY",
                delivery_address: addressId,
                totalAmt: totalAmt,
            })
        })

        const Order = await OrderModel.insertMany(payload)

        const removeCartItems = await cartProductModel.deleteMany({ userId: userId })
        const updateUser = await UserModel.updateOne({_id : userId},{ shopping_cart : []})

        return res.json({
            message : "Your Order is placed!",
            error : false,
            success : true,
            data : Order
        })


    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
} 