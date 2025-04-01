import {Router} from 'express'
import auth from '../middleware/auth.js'
import { EsewaInitiatePayment, fetchAllTransaction, getUserTransaction, paymentStatus } from '../controllers/esewa.controller.js'
import { admin } from '../middleware/admin.js'

const esewaRouter = Router()

esewaRouter.post('/initiate-payment',auth,EsewaInitiatePayment)
esewaRouter.post('/payment-status',auth,paymentStatus)
esewaRouter.get('/get',auth,admin,fetchAllTransaction)
esewaRouter.get('/get-userTransaction',auth,getUserTransaction)

export default esewaRouter