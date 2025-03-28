import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    orderId: {
        type: String,
        required: [true, "Provide OrderId"],
        unique: true
    },
    productId: {
        type: mongoose.Schema.ObjectId,
        ref: 'product'
    },
    product_details: [{
        productId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Product'
        },
        name: String,
        image: Array,
        quantity: Number 
    }],
    paymentId: {
        type: String,
        default: ""
    },
    payment_status: {
        type: String,
        default: ""
    },
    delivery_address: {
        type: mongoose.Schema.ObjectId,
        ref: 'address'
    },
    transaction: {
        type: mongoose.Schema.ObjectId,
        ref: 'Transaction'
    },
    totalQty: {
        type: Number,
        default: 0
    },
    subTotalAmt: {
        type: Number,
        default: 0
    },
    totalAmt: {
        type: Number,
        default: 0
    },
    invoice_receipt: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
})

const OrderModel = mongoose.model("order", orderSchema)

export default OrderModel