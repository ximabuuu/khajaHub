import {Router} from 'express'
import auth from '../middleware/auth.js'
import { CashOnDelivery, fetchAllCashOnDeliv, updateOrderStatus } from '../controllers/order.controller.js'
import { admin } from '../middleware/admin.js'

const OrderRouter = Router()

OrderRouter.post('/cashOnDelivery',auth,CashOnDelivery)
OrderRouter.get('/get',auth,admin,fetchAllCashOnDeliv)
OrderRouter.put('/update',auth,admin,updateOrderStatus)

export default OrderRouter