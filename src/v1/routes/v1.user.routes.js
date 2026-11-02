import { Router } from "express"
import { getUserController, updateUserController, deleteUserController, updatePlanController, listarClientesController, actualizarClienteController, eliminarClienteController } from "../controller/user.controller.js"
import { authMiddleware, requireRole } from "../../middleware/auth.middleware.js";
import { validateParamsIdClienteMiddleware } from "../../middleware/params.middleware.js";
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

// clientes, solo para el admin: listar, editar (sin el plan) y eliminar
userRoutes.get("/clientes", requireRole(Role.admin), listarClientesController);
userRoutes.patch("/clientes/:idCliente", requireRole(Role.admin), validateParamsIdClienteMiddleware, validateRequest(updateUserBodySchema, "body"), actualizarClienteController);
userRoutes.delete("/clientes/:idCliente", requireRole(Role.admin), validateParamsIdClienteMiddleware, eliminarClienteController);

export default userRoutes


