import {Router} from 'express'
import { AddProductController, deleteProductController, getFilteredProducts, getProductByCategory, getProductByCateSubCate, getProductByRestaurant, getProductController, getProductDetails, searchProduct, updateProductController } from '../controllers/product.controller.js'
import auth from '../middleware/auth.js'
import { admin } from '../middleware/admin.js'

const productRouter = Router()

productRouter.post('/add',auth,admin,AddProductController)
productRouter.get('/get',getProductController)
productRouter.post("/get-by-category",getProductByCategory)
productRouter.post('/get-by-category-subcategory',getProductByCateSubCate)
productRouter.post('/restaurant',getProductByRestaurant)
productRouter.post('/get-product-details',getProductDetails)

productRouter.put('/update',auth,admin,updateProductController)
productRouter.delete('/delete',auth,admin,deleteProductController)

productRouter.post('/search-products',searchProduct)

productRouter.get('/getmenu',getFilteredProducts)

export default productRouter