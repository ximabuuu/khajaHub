import {Router} from "express";
import auth from "../middleware/auth.js";
import { addRestaurant, deleteRestaurantController, getRestaurantController, updateRestaurantController } from "../controllers/restaurant.controller.js";
import { admin } from "../middleware/admin.js";

const restaurantRouter = Router()

restaurantRouter.post('/add',auth,admin,addRestaurant)
restaurantRouter.get('/get',auth,getRestaurantController)
restaurantRouter.put('/update',auth,admin,updateRestaurantController)
restaurantRouter.delete('/delete',auth,admin,deleteRestaurantController)

export default restaurantRouter