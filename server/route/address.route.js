import {Router} from 'express'
import auth from '../middleware/auth.js'
import { addAddressController, deleteAddressController, getAddressController, updateAddressController } from '../controllers/address.controller.js'

const AddressRouter = Router()

AddressRouter.post('/add',auth,addAddressController)
AddressRouter.get('/get',auth,getAddressController)
AddressRouter.put('/update',auth,updateAddressController)
AddressRouter.delete('/delete',auth,deleteAddressController)

export default AddressRouter