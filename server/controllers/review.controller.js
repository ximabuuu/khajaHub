import ProductModel from "../models/product.model.js";
import ReviewModel from "../models/review.model.js";

// Add a Review
export const addReview = async (req, res) => {
    try {
        const { productId, userId, rating, comment } = req.body;

        // Check if the product exists
        const product = await ProductModel.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // Create a new review
        const newReview = new ReviewModel({ productId, userId, rating, comment });
        await newReview.save();

        // Update product's reviews
        product.reviews.push(newReview._id);
        const totalReviews = product.reviews.length;
        const newAverageRating = (product.averageRating * (totalReviews - 1) + rating) / totalReviews;

        product.averageRating = newAverageRating.toFixed(1);
        await product.save();

        res.status(201).json({ success: true, message: "Review added successfully" });
    } catch (error) {
        console.error("Error adding review:", error); // Debugging
        res.status(500).json({ success: false, message: "Error adding review", error: error.message });
    }
};



export const getReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        const reviews = await ReviewModel.find({ productId }).populate("userId", "name");

        res.status(200).json({ success: true, data: reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching reviews", error });
    }
};