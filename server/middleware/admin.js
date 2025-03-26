import UserModel from "../models/user.model.js";

export const admin = async (req, res, next) => {
    try {
        console.log("Authenticated User ID:", req.userId); // Debugging

        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized: No user ID found",
                error: true,
                success: false
            });
        }

        const user = await UserModel.findById(userId);
        console.log("User role:", user?.role); // Debugging

        if (!user || user.role !== "ADMIN") {
            return res.status(403).json({
                message: "Permission Denial",
                error: true,
                success: false
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: true,
            success: false
        });
    }
};
