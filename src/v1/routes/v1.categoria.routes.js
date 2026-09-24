import { Router } from "express";
import {
    listarCategorias, getCategoria, createCategoriaController,
    updateCategoriaController, deleteCategoriaController
} from "../controller/categoria.controller.js";
import { authMiddleware, requireRole } from "../../middleware/auth.middleware.js";
import { validateRequest } from "../../middleware/validate.middleware.js";
import { categoriaBodySchema, editarCategoriaBodySchema } from "../../schemas/categoria.body.schema.js";
import { Role } from "../../constants/role.constants.js";

const categoriaRoutes = Router();

categoriaRoutes.get("/", listarCategorias);
categoriaRoutes.get("/:idCategoria", getCategoria);

categoriaRoutes.use(authMiddleware);
categoriaRoutes.use(requireRole(Role.admin));

categoriaRoutes.post("/", validateRequest(categoriaBodySchema, "body"), createCategoriaController);
categoriaRoutes.patch("/:idCategoria", validateRequest(editarCategoriaBodySchema, "body"), updateCategoriaController);
categoriaRoutes.delete("/:idCategoria", deleteCategoriaController);

export default categoriaRoutes;
