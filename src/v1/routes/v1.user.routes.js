import { Router } from "express"
import { getUserController, updateUserController, deleteUserController, updatePlanController } from "../controller/user.controller.js"
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { validateRequest } from "../../middleware/validate.middleware.js";
import { planBodySchema } from "../../schemas/plan-body.schema.js";
import { updateUserBodySchema } from "../../schemas/update-user-body.schema.js";

const userRoutes = Router();

userRoutes.use(authMiddleware);

userRoutes.get("/", getUserController);
userRoutes.patch("/", validateRequest(updateUserBodySchema, "body"), updateUserController);
userRoutes.delete("/", deleteUserController);

userRoutes.patch("/plan", validateRequest(planBodySchema, "body"), updatePlanController);

export default userRoutes
