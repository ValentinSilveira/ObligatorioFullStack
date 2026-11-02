import { Router } from "express"
import { getUserController, updateUserController, deleteUserController, updatePlanController, listarClientesController } from "../controller/user.controller.js"
import { authMiddleware, requireRole } from "../../middleware/auth.middleware.js";
import { Role } from "../../constants/role.constants.js";
import { validateRequest } from "../../middleware/validate.middleware.js";
import { planBodySchema } from "../../schemas/plan-body.schema.js";
import { updateUserBodySchema } from "../../schemas/update-user-body.schema.js";

const userRoutes = Router();

userRoutes.use(authMiddleware);

userRoutes.get("/", getUserController);
userRoutes.patch("/", validateRequest(updateUserBodySchema, "body"), updateUserController);
userRoutes.delete("/", deleteUserController);
//TODO: BORRAR QUE NO USAMOS EL CRUD DE USER

userRoutes.patch("/plan", validateRequest(planBodySchema, "body"), updatePlanController);

// lista de clientes, solo para el admin
userRoutes.get("/clientes", requireRole(Role.admin), listarClientesController);

export default userRoutes


