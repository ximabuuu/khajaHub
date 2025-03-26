import CategoryModel from '../models/category.model.js'
import SubCategoryModel from '../models/subCategory.model.js'
import ProductModel from '../models/product.model.js'

export const addCategoryController =async (req,res)=>{
    try {
        const {name,image} = req.body

        if (!name || !image) {
            return res.status(400).json({
                message : "Enter required fields",
                error : true,
                success : false
            })
        }

        const payload = {
            name,
            image
        }
        const addCategory = new CategoryModel({
            name,
            image
        })

        const saveCategory =await addCategory.save()

        return res.json({
            message : "Category added Successfully",
            error : false,
            success : true
        })

    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success: false
        })
    }
} 

export const getCategoryController =async (req,res)=>{
    try {
        
        const data = await CategoryModel.find()

        return res.json({
            data : data,
            error : false,
            success : true
        })

    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export const updateCategoryController = async (req,res) => {
    try {
        const {_id,name,image} = req.body

        const update = await CategoryModel.updateOne({
            _id : _id
        },{
            name,
            image
        })

        return res.json({
            message : "Category Updated Successfully.",
            success : true,
            error : false,
            data : update
        })

    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export const deleteCategoryController = async (req,res) => {
    try {
        const { _id } = req.body

        const checkSubCategory = await SubCategoryModel.find({
            category : {
                "$in" : [_id]
            }
        }).countDocuments()
        const checkProduct = await ProductModel.find({
            category : {
                "$in" : [_id]
            }
        }).countDocuments()

        if(checkSubCategory > 0 || checkProduct > 0){
            return res.status(400).json({
                message : "This Category is in use.",
                error : true,
                success : false
            })
        }

        const deleteCategory = await CategoryModel.deleteOne({_id : _id})

        return res.json({
            message : "Category deleted Successfully",
            data : deleteCategory,
            error : false,
            success : true

        })

    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            Success : false
        })
    }
}