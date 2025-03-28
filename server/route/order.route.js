import {Router} from 'express'
import auth from '../middleware/auth.js'
import { CashOnDelivery, fetchAllCashOnDeliv } from '../controllers/order.controller.js'
import { admin } from '../middleware/admin.js'

const OrderRouter = Router()

OrderRouter.post('/cashOnDelivery',auth,CashOnDelivery)
OrderRouter.get('/get',auth,admin,fetchAllCashOnDeliv)

export default OrderRouter