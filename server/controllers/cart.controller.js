import cartProductModel from "../models/cartProduct.model.js"
import UserModel from "../models/user.model.js"


export const addToCartController = async (req, res) => {
    try {
        const userId = req.userId
    
        if (!userId) {
            return res.status(401).json({
                message: "You must be logged in to add items.",
                error: true,
                success: false
            });
        }

        const { productId } = req.body

        if (!productId) {
            return res.status(400).json({
                message: "Provide Product Id",
                error: true,
                success: false
            })
        }

        const checkItemInCart = await cartProductModel.findOne({
            userId: userId,
            productId: productId
        })

        if (checkItemInCart) {
            return res.status(400).json({
                message: "Item is already in cart"
            })
        }

        const cartItem = new cartProductModel({
            quantity: 1,
            userId: userId,
            productId: productId
        })
        const save = await cartItem.save()

        const updateCartUser = await UserModel.updateOne({
            _id: userId
        }, {
            $push: {
                shopping_cart: productId
            }
        })

        return res.json({
            data: save,
            message: "Item added successfully",
            error: false,
            success: true
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const getCartItemController = async (req, res) => {
    try {

        const userId = req.userId

        const cartItem = await cartProductModel.find({
            userId: userId
        }).populate('productId userId')

        return res.json({
            data: cartItem,
            error: false,
            success: true
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const updateCartItemQtyController = async (req, res) => {
    try {

        const userId = req.userId

        const { _id, qty } = req.body

        if (!_id || !qty) {
            return res.status(400).json({
                message: "Provide Id and Quantity"
            })
        }

        const update = await cartProductModel.updateOne({
            _id: _id,
            userId: userId
        }, {
            quantity: qty
        })

        return res.json({
            message: "Item Updated",
            data: update,
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

export const deleteCartItem = async (req, res) => {
    try {

        const userId = req.userId

        const { _id } = req.body

        if (!_id) {
            return res.status(400).json({
                message: "Provide _Id",
                error: true,
                success: false
            })
        }

        const deleteCart = await cartProductModel.deleteOne({
            _id: _id,
            userId: userId
        })

        return res.json({
            message: "Item removed from Cart",
            data: deleteCart,
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


export const clearUserCart = async (req, res) => {
    try {
        const userId = req.userId;
        
        console.log("Clearing cart for user:", userId);

        const result = await cartProductModel.deleteMany({ userId: userId });

        console.log("Delete result:", result);

        if (result.deletedCount === 0) {
            return res.status(400).json({ message: "No items found in cart to delete." });
        }

        res.status(200).json({ message: "Cart emptied successfully!" });
    } catch (error) {
        console.error("Error clearing cart:", error);
        res.status(500).json({ message: "Failed to empty cart", error: error.message });
    }
};
