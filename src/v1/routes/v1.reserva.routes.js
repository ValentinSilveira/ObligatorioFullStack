import { Router } from "express";
import {
    reservarTurno, listarReservas,
    cancelarReservaController, reprogramarReservaController
} from "../controller/reserva.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { middlewareValidateReservaBody, middlewareValidateReprogramarBody } from "../../middleware/validateReserva.middleware.js";

const turnosRoutes = Router();

turnosRoutes.use(authMiddleware);

turnosRoutes.get("/", listarReservas);
turnosRoutes.post("/", middlewareValidateReservaBody, reservarTurno);
turnosRoutes.patch("/:idReserva", middlewareValidateReprogramarBody, reprogramarReservaController);
turnosRoutes.delete("/:idReserva", cancelarReservaController);

export default turnosRoutes;
