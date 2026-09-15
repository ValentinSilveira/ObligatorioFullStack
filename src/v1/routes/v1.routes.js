import { Router } from "express"
import userRoutes from "./v1.user.routes.js"
import authRoutes from "./v1.auth.routes.js";
import reservaRoutes from "./v1.reserva.routes.js";


const v1Routes = Router()

v1Routes.use("/auth", authRoutes);
v1Routes.use("/users", userRoutes)
v1Routes.use("/reservas", reservaRoutes)
//TODO: agregar para productos

export default v1Routes