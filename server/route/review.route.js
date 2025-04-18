import { Router } from "express";
import auth from "../middleware/auth.js";
import { addReview, getAllReviews, getReviews } from "../controllers/review.controller.js";

const reviewRouter = Router()

reviewRouter.post('/add',auth,addReview)
reviewRouter.get('/get',getReviews)
reviewRouter.get('/getall',getAllReviews)

export default reviewRouter