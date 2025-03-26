import {Router} from 'express'
import auth from '../middleware/auth.js'
import { EsewaInitiatePayment, paymentStatus } from '../controllers/esewa.controller.js'

const esewaRouter = Router()

esewaRouter.post('/initiate-payment',auth,EsewaInitiatePayment)
esewaRouter.post('/payment-status',auth,paymentStatus)

export default esewaRouter