import mongoose from "mongoose"
import ProductModel from "../models/product.model.js"


export const AddProductController = async (req, res) => {
    try {
        const { name, image, category, subCategory, restaurant, unit, stock, price, discount, description, more_details } = req.body

        if (!name || !image[0] || !category[0] || !subCategory[0] || !restaurant[0] || !unit || !stock || !price || !discount || !description) {
            return res.status(400).json({
                message: "Enter Required Fields",
                error: true,
                success: false
            })
        }

        const product = new ProductModel({
            name,
            image,
            category,
            subCategory,
            restaurant,
            unit,
            stock,
            price,
            discount,
            description,
            more_details,
        })
        const saveProduct = await product.save()

        return res.json({
            message: "Product Added Successfully",
            data: saveProduct,
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

export const getProductController = async (req, res) => {
    try {

        let { page, limit, search } = req.query
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 12;

        const query = search ? {
            $text: {
                $search: search
            }
        } : {}

        const skip = (page - 1) * limit

        const [data, totalcount] = await Promise.all([
            ProductModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('category subCategory restaurant'),
            ProductModel.countDocuments(query)
        ])

        return res.json({
            data: data,
            error: false,
            success: true,
            totalCount: totalcount,
            totalNoPage: Math.ceil(totalcount / limit)
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const getProductByCategory = async (req, res) => {
    try {
        const { id } = req.body

        if (!id) {
            return res.status(400).json({
                message: "Category ID is not Provided",
                error: true,
                success: false
            })
        }

        const product = await ProductModel.find({
            category: { $in: id }
        }).limit(10).sort({ createdAt: -1 })

        return res.json({
            message: "Category Product List",
            data: product,
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

export const getProductByCateSubCate = async (req, res) => {
    try {
        let { categoryId, subCategoryId, page, limit } = req.body

        if (!categoryId || !subCategoryId) {
            return res.status(400).json({
                message: "Provide Category ID and Sub Category ID",
                error: true,
                success: false
            })
        }
        if (!mongoose.Types.ObjectId.isValid(categoryId) || !mongoose.Types.ObjectId.isValid(subCategoryId)) {
            return res.status(400).json({
                message: "Invalid Category ID or Sub Category ID format",
                error: true,
                success: false
            });
        }

        if (!page) {
            page = 1
        }

        if (!limit) {
            limit = 10
        }

        const categoryObjectId = new mongoose.Types.ObjectId(categoryId);
        const subCategoryObjectId = new mongoose.Types.ObjectId(subCategoryId);

        const query = {
            category: { $in: categoryObjectId },
            subCategory: { $in: subCategoryObjectId }
        }

        const skip = (page - 1) * limit

        const [data, dataCount] = await Promise.all([
            ProductModel.find(query).skip(skip).sort({ createdAt: -1 }),
            ProductModel.countDocuments(query)
        ])

        return res.json({
            message: "Product List",
            data: data,
            totalCount: dataCount,
            page: page,
            limit: limit,
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

export const getProductByRestaurant = async (req, res) => {
    try {
        const { restaurantId } = req.body

        if (!restaurantId) {
            return res.status(400).json({ message: 'restaurantId is required' })
        }

        const products = await ProductModel.find({ restaurant: restaurantId }).populate('restaurant')

        res.json({ success: true, data: products })
    } catch (error) {
        console.error('Error fetching products by restaurant:', error)
        res.status(500).json({ success: false, message: 'Server Error' })
    }
}

export const getProductDetails = async (req, res) => {
    try {
        const { productId } = req.body

        const product = await ProductModel.findOne({ _id: productId }).populate('restaurant', 'name')



        return res.json({
            message: "Product Details",
            data: product,
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

export const updateProductController = async (req, res) => {
    try {
        const { _id } = req.body

        const update = await ProductModel.updateOne({
            _id: _id
        }, {
            ...req.body
        })

        return res.json({
            message: "Product Updated Successfully.",
            success: true,
            error: false,
            data: update
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const deleteProductController = async (req, res) => {
    try {
        const { _id } = req.body

        if (!_id) {
            return res.status(400).json({
                message: "Provide ID",
                error: true,
                success: false
            })
        }

        const deleteProduct = await ProductModel.deleteOne({
            _id: _id
        })

        return res.json({
            message: "Product Deleted Successfully.",
            success: true,
            error: false,
            data: deleteProduct
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const searchProduct = async (req, res) => {
    try {
        let { search, page, limit } = req.body

        if (!page) {
            page = 1
        }
        if (!limit) {
            limit = 10
        }

        const query = search ? {
            $text: {
                $search: search
            }
        } : {}

        const skip = (page - 1) * limit
        const [data, dataCount] = await Promise.all([
            ProductModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('category subCategory'),
            ProductModel.countDocuments(query)
        ])

        return res.json({
            message: "Products data",
            error: false,
            success: true,
            data: data,
            totalCount: dataCount,
            totalPage: Math.ceil(dataCount / limit),
            page: page,
            limit: limit
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}