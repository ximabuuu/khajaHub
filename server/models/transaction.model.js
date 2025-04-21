import mongoose from "mongoose"

const transactionSchema = new mongoose.Schema({
    product_id: {
        type: String,
        required: true,
        unique: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        required: true,
        enum: ["PENDING", "COMPLETE", "FAILED", "REFUNDED"],
        default: "PENDING"
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    product_details: [{
        productId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Product'
        },
        name: String,
        image: Array,
        quantity: Number,
        unit: String,
        restaurant: String
    }],
    delivery_address: {
        type: mongoose.Schema.ObjectId,
        ref: 'address'
    },
    totalQty: {
        type: Number,
        default: 0
    },
    orderStatus: {
        type: String,
        enum: ["Pending", "Accepted", "Picked", "Delivered"],
        default: "Pending",
    },
    rider: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },


}, { timestamps: true }

)

const TransactionModel = mongoose.model("Transaction", transactionSchema)
export default TransactionModel