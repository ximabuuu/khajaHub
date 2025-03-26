import { Router } from "express";
import auth from "../middleware/auth.js";
import { addReview, getReviews } from "../controllers/review.controller.js";

const reviewRouter = Router()

reviewRouter.post('/add',auth,addReview)
reviewRouter.get('/get',getReviews)

export default reviewRouter