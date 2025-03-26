import mongoose from "mongoose"

const transactionSchema = new mongoose.Schema({
    product_id: {
        type: String,
        required: true
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
    

}, { timestamps: true }

)

const TransactionModel = mongoose.model("Transaction", transactionSchema)
export default TransactionModel