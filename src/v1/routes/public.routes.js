import { Router } from "express"
import { transformTextController } from "../controller/transform-text.controller.js";

const publicRoutes = Router();

publicRoutes.post("/embellecer", transformTextController);;

export default publicRoutes

