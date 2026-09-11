import { Router } from "express"
import userRoutes from "./v1.user.routes.js"
// import authRoutes from "./v1.auth.routes.js";


const v1Routes = Router()

// v1Routes.use("/auth", authRoutes);

v1Routes.use("/users", userRoutes)
//TODO: agregar para productos y authenticacion

export default v1Routes