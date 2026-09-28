import { Router } from "express"
import { middlewareValidateLoginBody, middlewareValidateRegisterBody } from "../../middleware/auth.middleware.js";
import { loginController, registerController } from "../controller/auth.controller.js";
import { loginRateLimit } from "../middleware/rate-limit.middleware.js";


const authRoutes = Router();



authRoutes.post("/login", loginRateLimit, middlewareValidateLoginBody, loginController);
authRoutes.post("/register", middlewareValidateRegisterBody, registerController);


export default authRoutes