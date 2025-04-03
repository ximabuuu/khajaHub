import { Router } from 'express'
import auth from '../middleware/auth.js'
import { EsewaInitiatePayment, fetchAllTransaction, getUserTransaction, paymentStatus, updateEsewaStatus } from '../controllers/esewa.controller.js'
import { admin } from '../middleware/admin.js'
import { adminorrider } from '../middleware/rider.js'

const esewaRouter = Router()

esewaRouter.post('/initiate-payment', auth, EsewaInitiatePayment)
esewaRouter.post('/payment-status', auth, paymentStatus)
esewaRouter.get('/get', auth, adminorrider, fetchAllTransaction);
esewaRouter.get('/get-userTransaction', auth, getUserTransaction)
esewaRouter.put('/:orderId/',auth,adminorrider,updateEsewaStatus)

export default esewaRouter