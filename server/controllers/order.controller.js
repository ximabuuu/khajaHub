import mongoose from "mongoose"
import OrderModel from "../models/order.model.js"
import cartProductModel from "../models/cartProduct.model.js"
import UserModel from "../models/user.model.js"
import Twilio from 'twilio'

const twilioClient = Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

async function sendSMS() {
    const message = await twilioClient.messages.create({
        body: 'Haina hola hai',
        from: '+12013892431',
        to: process.env.PHONE_NUMBER
    })
}



export const CashOnDelivery = async (req, res) => {
    try {

        const userId = req.userId
        const { list_items, totalAmt, addressId, totalQty } = req.body


        const orderId = `ORD-${new mongoose.Types.ObjectId()}`;


        const products = list_items.map(el => ({
            productId: el.productId._id,
            name: el.productId.name,
            image: el.productId.image,
            quantity: el.quantity,
            unit: el.productId.unit
        }));

        const payload = {
            userId: userId,
            orderId: orderId,
            product_details: products,
            paymentId: "",
            payment_status: "CASH ON DELIVERY",
            delivery_address: addressId,
            totalAmt: totalAmt,
            totalQty: totalQty
        };

        const Order = await OrderModel.insertMany(payload)


        const removeCartItems = await cartProductModel.deleteMany({ userId: userId })
        const updateUser = await UserModel.updateOne({ _id: userId }, { shopping_cart: [] })

        sendSMS()


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
    try {
        const { orderId } = req.params
        const { orderStatus } = req.body

        if (!["Pending", "Picked", "Delivered"].includes(orderStatus)) {
            return res.status(400).json({ error: "Invalid status" });
        }

        const order = await OrderModel.findByIdAndUpdate(
            orderId,
            { orderStatus },
            { new: true }
        );

        if (!order) return res.status(404).json({ error: "Order not found" });

        res.json(order);

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
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
};
