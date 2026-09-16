import { Router } from "express"
import { getUserController, updateUserController, deleteUserController, updatePlanController } from "../controller/user.controller.js"
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { validateRequest } from "../../middleware/validate.middleware.js";
import { planBodySchema } from "../../schemas/plan-body.schema.js";

const userRoutes = Router();

userRoutes.use(authMiddleware);

userRoutes.get("/", getUserController);
userRoutes.patch("/", updateUserController);
userRoutes.delete("/", deleteUserController);
//TODO: VER SI LO USAMOS 

userRoutes.patch("/plan", validateRequest(planBodySchema, "body"), updatePlanController);

export default userRoutes


