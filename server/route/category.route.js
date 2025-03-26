import { Router } from "express";
import auth from "../middleware/auth.js";
import { addCategoryController, deleteCategoryController, getCategoryController, updateCategoryController } from "../controllers/category.controller.js";
import { admin } from "../middleware/admin.js";

const categoryRouter = Router()

categoryRouter.post("/add-category",auth,admin,addCategoryController)
categoryRouter.get("/getCategory",getCategoryController)
categoryRouter.put("/update",auth,admin,updateCategoryController)
categoryRouter.delete("/delete",auth,admin,deleteCategoryController)

export default categoryRouter