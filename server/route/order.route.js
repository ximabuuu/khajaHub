import {Router} from 'express'
import auth from '../middleware/auth.js'
import { CashOnDelivery } from '../controllers/order.controller.js'

const OrderRouter = Router()

OrderRouter.post('/cashOnDelivery',auth,CashOnDelivery)

export default OrderRouter