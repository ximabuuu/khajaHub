import mongoose from "mongoose"
import OrderModel from "../models/order.model.js"
import cartProductModel from "../models/cartProduct.model.js"
import UserModel from "../models/user.model.js"


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
    const { orderId } = req.params;
    const { orderStatus } = req.body;
    const riderId = req.userId; // Extract rider ID from authenticated user

    try {
        // Fetch the user details
        const rider = await UserModel.findById(riderId);

        if (!rider || rider.role !== "RIDER") {
            return res.status(403).json({ message: "Only riders can accept orders" });
        }

        const updatedOrder = await OrderModel.findByIdAndUpdate(
            orderId,
            { orderStatus, rider: riderId }, // Assign Rider
            { new: true }
        ).populate("rider", "name mobile"); // Populate Rider Details

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.json({
            message: "Order status updated successfully!",
            success: true,
            error: false,
            data: updatedOrder
        });

    } catch (error) {
        res.status(500).json({
            message: "Error updating order status",
            success: false,
            error: true
        });
    }
};

export const getUserOrders = async (req, res) => {
    try {
        const userId = req.userId

        const userOrders = await OrderModel.find({ userId: userId })
            .populate("userId")
            .populate("delivery_address")
            .populate("rider", "name mobile role")
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
