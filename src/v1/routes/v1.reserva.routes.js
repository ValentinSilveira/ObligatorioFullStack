import { Router } from "express";
import {
    reservarTurno, listarReservas,
    cancelarReservaController, reprogramarReservaController
} from "../controller/reserva.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { middlewareValidateReservaBody, middlewareValidateReprogramarBody } from "../../middleware/validateReserva.middleware.js";
import { validateParamsIdReservaMiddleware } from "../../middleware/params.middleware.js";
import { generarQrReservaController } from "../controller/api-externas.controller.js";

const turnosRoutes = Router();

turnosRoutes.use(authMiddleware);

turnosRoutes.get("/", listarReservas);
turnosRoutes.post("/", middlewareValidateReservaBody, reservarTurno);
turnosRoutes.patch("/:idReserva", validateParamsIdReservaMiddleware, middlewareValidateReprogramarBody, reprogramarReservaController);
turnosRoutes.delete("/:idReserva", validateParamsIdReservaMiddleware, cancelarReservaController);
turnosRoutes.get("/:idReserva/qr", validateParamsIdReservaMiddleware, generarQrReservaController);

   
// TODO: agregar middlewares para validar rol (para cosas que solo pueda hacer el admin) y de params

export default turnosRoutes;
