import { Router } from "express";
import {
    listarCategorias, getCategoria, createCategoriaController,
    updateCategoriaController, deleteCategoriaController
} from "../controller/categoria.controller.js";
import { authMiddleware, requireRole } from "../../middleware/auth.middleware.js";
import { validateRequest } from "../../middleware/validate.middleware.js";
import { categoriaBodySchema, editarCategoriaBodySchema } from "../../schemas/categoria.body.schema.js";
import { Role } from "../../constants/role.constants.js";
import { validateParamsIdCategoriaMiddleware } from "../../middleware/params.middleware.js";

const categoriaRoutes = Router();

categoriaRoutes.use(authMiddleware);

categoriaRoutes.get("/", listarCategorias);
categoriaRoutes.get("/:idCategoria", validateParamsIdCategoriaMiddleware, getCategoria);

categoriaRoutes.use(requireRole(Role.admin));

categoriaRoutes.post("/", validateRequest(categoriaBodySchema, "body"), createCategoriaController);
categoriaRoutes.patch("/:idCategoria", validateParamsIdCategoriaMiddleware, validateRequest(editarCategoriaBodySchema, "body"), updateCategoriaController);
categoriaRoutes.delete("/:idCategoria", validateParamsIdCategoriaMiddleware, deleteCategoriaController);

export default categoriaRoutes;
