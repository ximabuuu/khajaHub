import ProductModel from "../models/product.model.js"
import SubCategoryModel from "../models/subCategory.model.js"

export const AddSubCategoryController = async (req,res) => {
    try {
        const {name, image, category } = req.body

        if (!name && !image && !category[0]) {
            return res.status(400).json({
                message : "Provide Required Fields",
                error : true,
                success : false
            })
        }

        const payload = {
            name,
            image,
            category
        }

        const addSubCategory = new SubCategoryModel(payload)
        const save = await addSubCategory.save()

        return res.status(201).json({
            message : "Sub Category added successfully.",
            data : save,
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

export const getSubCategoryController =async (req,res)=>{
    try {
        
        const data = await SubCategoryModel.find().populate('category')

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

export const updateSubCategoryController = async (req,res) => {
    try {
        const {_id,name,image,category} = req.body

        const checksubcate = await SubCategoryModel.findById(_id)

        if (!checksubcate) {
            return res.status(400).json({
                message : "Check your id",
                error : true,
                success : false
            })
        }

        const updateSubCategory = await SubCategoryModel.findByIdAndUpdate(_id,{
            name,
            image,
            category
        })

        return res.json({
            message : "Sub Category Updated Successfully.",
            success : true,
            error : false,
            data : updateSubCategory
        })

    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export const deleteSubCategoryController = async (req,res) => {
    try {
        const { _id } = req.body


        const deleteCategory = await SubCategoryModel.findByIdAndDelete({_id : _id})
        console.log("delete",deleteCategory)
        return res.json({
            message : "Sub Category deleted Successfully",
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