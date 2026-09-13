import { Router } from "express"
import { middlewareValidateLoginBody, middlewareValidateRegisterBody } from "../../middleware/auth.middleware.js";
import { loginController, registerController } from "../controller/auth.controller.js";


const authRoutes = Router();



authRoutes.post("/login", middlewareValidateLoginBody, loginController);
authRoutes.post("/register", middlewareValidateRegisterBody, registerController);


export default authRoutes