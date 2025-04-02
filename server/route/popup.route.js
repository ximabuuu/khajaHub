import {Router} from 'express'
import auth from '../middleware/auth.js'
import { admin } from '../middleware/admin.js'
import { addPopup, getPopUpController } from '../controllers/popup.controller.js'

const PopUpRouter = Router()

PopUpRouter.post('/add',auth,admin,addPopup)
PopUpRouter.get('/get',getPopUpController)

export default PopUpRouter