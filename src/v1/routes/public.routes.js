import { Router } from "express"
import { transformTextController } from "../controller/transform-text.controller.js";

const publicRoutes = Router();

publicRoutes.post("/embellecer", transformTextController);
// publicRoutes.get("/user-externos", obtenerUsuariosExternosController);

export default publicRoutes

