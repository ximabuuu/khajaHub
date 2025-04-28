import mongoose from "mongoose"
import OrderModel from "../models/order.model.js"
import cartProductModel from "../models/cartProduct.model.js"
import UserModel from "../models/user.model.js"


export const CashOnDelivery = async (req, res) => {
    try {

        const userId = req.userId
        const { list_items, totalAmt, addressId, totalQty } = req.body


        const orderId = `ORD-${new mongoose.Types.ObjectId()}`;


        const products = list_items.map(el => {
            console.log(el)
            return{

                productId: el.productId._id,
                name: el.productId.name,
                image: el.productId.image,
                quantity: el.quantity,
                unit: el.productId.unit,
                restaurant: el.restaurant
            }
        });

        const payload = {
            userId: userId,
            orderId: orderId,
            product_details: products,
            paymentId: "",
            payment_status: "CASH ON DELIVERY",
            delivery_address: addressId,
            totalAmt: totalAmt,
            totalQty: totalQty,
            orderStatus: "Pending",
            rider: null
        };

        const Order = await OrderModel.insertMany(payload)


        const removeCartItems = await cartProductModel.deleteMany({ userId: userId })
        const updateUser = await UserModel.updateOne({ _id: userId }, { shopping_cart: [] })


        const user = await UserModel.findById(userId);


        return res.json({
            message: "Your Order is placed!",
            error: false,
            success: true,
            data: Order
        })


    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}


export const fetchAllCashOnDeliv = async (req, res) => {
    try {
        const AllCash = await OrderModel.find().sort({ createdAt: -1 })
            .populate('userId', 'name')
            .populate('delivery_address', 'address_line city mobile')
            .populate("rider", "name mobile ")
            .populate('productId')
        return res.json({
            message: "All Data Fetched",
            success: true,
            error: false,
            data: AllCash
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            success: false,
            error: true
        })
    }
}

export const updateOrderStatus = async (req, res) => {
    const { orderId } = req.params
    const { orderStatus, latitude, longitude } = req.body
    const riderId = req.userId

    try {
        const rider = await UserModel.findById(riderId)

        if (!rider || rider.role !== "RIDER") {
            return res.status(403).json({ message: "Only riders can accept orders" })
        }

        if (latitude && longitude) {
            await UserModel.findByIdAndUpdate(riderId, {
                location: { latitude, longitude }
            });
        }

        const order = await OrderModel.findById(orderId)

        if (!order) {
            return res.status(404).json({ message: "Order not found" })
        }

        // If order is pending, allow anyone to accept
        if (order.orderStatus === "Pending" && orderStatus === "Accepted") {
            order.orderStatus = "Accepted"
            order.rider = riderId
        }
        else {
            // If already accepted or picked, only assigned rider can change
            if (!order.rider || order.rider.toString() !== riderId.toString()) {
                return res.status(403).json({ message: "You are not assigned to this order" })
            }
            order.orderStatus = orderStatus
        }

        await order.save()

        await order.populate("rider", "name mobile location _id")

        res.json({
            message: "Order status updated successfully!",
            success: true,
            error: false,
            data: order
        })

    } catch (error) {
        res.status(500).json({
            message: "Error updating order status",
            success: false,
            error: true
        })
    }
}

export const getUserOrders = async (req, res) => {
    try {
        const userId = req.userId

        const userOrders = await OrderModel.find({ userId: userId })
            .populate("userId")
            .populate("delivery_address")
            .populate("rider", "name mobile role location avatar")
            .sort({ createdAt: -1 })

        return res.json({
            message: "User orders fetched successfully!",
            error: false,
            success: true,
            data: userOrders
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}
