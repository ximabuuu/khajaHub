import { EsewaPaymentGateway, EsewaCheckStatus } from "esewajs";
import TransactionModel from "../models/transaction.model.js";
import UserModel from "../models/user.model.js";


const EsewaInitiatePayment = async (req, res) => {
  const userId = req.userId
  const { amount, productId, list_items, addressId, totalQty } = req.body
  try {
    const reqPayment = await EsewaPaymentGateway(
      amount, 0, 0, 0, productId, process.env.MERCHANT_ID, process.env.SECRET, process.env.SUCCESS_URL, process.env.FAILURE_URL, process.env.ESEWAPAYMENT_URL, undefined, undefined)
    if (!reqPayment || reqPayment.status !== 200) {
      console.error("Esewa Payment Error:", reqPayment?.data || reqPayment);
      return res.status(400).json("Esewa payment failed.");
    }

    const products = list_items.map(el => ({
      productId: el.productId._id,
      name: el.productId.name,
      image: el.productId.image,
      quantity: el.quantity,
      unit: el.productId.unit,
      restaurant: el.restaurant
    }));

    if (reqPayment.status === 200) {
      const transaction = new TransactionModel({
        userId: userId,
        product_id: productId,
        amount: amount,
        product_details: products,
        totalQty: totalQty,
        delivery_address: addressId,
        orderStatus: "Pending",
        rider: null
      });
      const saveTransaction = await transaction.save();

      const addUserAddress = await UserModel.findByIdAndUpdate(userId, {
        $push: {
          transaction: saveTransaction._id
        }
      })

      return res.send({
        url: reqPayment.request.res.responseUrl,
      });
    }
  }
  catch (error) {
    return res.status(400).json("error sending data")

  }
}

const paymentStatus = async (req, res) => {
  const { product_id } = req.body; // Extract data from request body
  try {
    // Find the transaction by its signature
    const transaction = await TransactionModel.findOne({ product_id });
    if (!transaction) {
      return res.status(400).json({ message: "Transaction not found" });
    }

    const paymentStatusCheck = await EsewaCheckStatus(transaction.amount, transaction.product_id, process.env.MERCHANT_ID, process.env.ESEWAPAYMENT_STATUS_CHECK_URL)



    if (paymentStatusCheck.status === 200) {
      // Update the transaction status
      transaction.status = paymentStatusCheck.data.status;
      await transaction.save();
      res
        .status(200)
        .json({ message: "Transaction status updated successfully" });
    }
  } catch (error) {
    console.error("Error updating transaction status:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export { EsewaInitiatePayment, paymentStatus }


export const fetchAllTransaction = async (req, res) => {
  try {
    const AllTrans = await TransactionModel.find()
      .populate('userId')
      .populate('delivery_address', 'city mobile address_line')
      .populate('rider', 'name mobile')

    return res.json({
      message: "All Transaction Fetched.",
      success: true,
      error: false,
      data: AllTrans
    })

  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true
    })
  }
}

export const getUserTransaction = async (req, res) => {
  try {
    const userId = req.userId

    const userOrders = await TransactionModel.find({ userId: userId })
      .populate("userId")
      .populate("delivery_address")
      .populate("rider", 'name mobile location avatar')
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

export const updateEsewaStatus = async (req, res) => {
  const { orderId } = req.params;
  const { orderStatus, latitude, longitude } = req.body;
  const riderId = req.userId;

  try {
    // Fetch the user details
    const rider = await UserModel.findById(riderId);

    if (!rider || rider.role !== "RIDER") {
      return res.status(403).json({ message: "Only riders can accept orders" });
    }

    if (latitude && longitude) {
      await UserModel.findByIdAndUpdate(riderId, {
        location: {
          latitude,
          longitude
        }
      });
    }

    const order = await TransactionModel.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // If order is pending, allow anyone to accept
    if (order.orderStatus === "Pending" && orderStatus === "Accepted") {
      order.orderStatus = "Accepted";
      order.rider = riderId;
    } else {
      // If already accepted, picked, or delivered — only assigned rider can update
      if (!order.rider || order.rider.toString() !== riderId.toString()) {
        return res.status(403).json({ message: "You are not assigned to this order" });
      }
      order.orderStatus = orderStatus;
    }

    await order.save();
    await order.populate("rider", "name mobile location _id");

    res.json({
      message: "Order status updated successfully!",
      success: true,
      error: false,
      data: order
    });

  } catch (error) {
    res.status(500).json({
      message: "Error updating order status",
      success: false,
      error: true
    });
  }
}

