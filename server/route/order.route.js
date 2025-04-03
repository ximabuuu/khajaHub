import {Router} from 'express'
import auth from '../middleware/auth.js'
import { CashOnDelivery, fetchAllCashOnDeliv, getUserOrders, updateOrderStatus } from '../controllers/order.controller.js'
import { admin } from '../middleware/admin.js'
import { adminorrider } from '../middleware/rider.js'

const OrderRouter = Router()

OrderRouter.post('/cashOnDelivery',auth,CashOnDelivery)
OrderRouter.get('/get',auth,adminorrider,fetchAllCashOnDeliv)
OrderRouter.put('/:orderId/',auth,adminorrider,updateOrderStatus)
OrderRouter.get('/getorder',auth,getUserOrders)

export default OrderRouter