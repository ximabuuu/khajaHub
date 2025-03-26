import { Router } from 'express';
import auth from '../middleware/auth.js';
import { addToCartController, clearUserCart, deleteCartItem, getCartItemController, updateCartItemQtyController } from '../controllers/cart.controller.js';

const cartRouter = Router()

cartRouter.post('/add',auth,addToCartController)
cartRouter.get('/get',auth,getCartItemController)
cartRouter.put('/update-qty',auth,updateCartItemQtyController)
cartRouter.delete('/delete',auth,deleteCartItem)
cartRouter.delete('/clear',auth,clearUserCart)

export default cartRouter