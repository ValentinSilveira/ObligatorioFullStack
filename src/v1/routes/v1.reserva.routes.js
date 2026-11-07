import { Router } from "express";
import {
  reservarTurno,
  listarReservas,
  cancelarReservaController,
  reprogramarReservaController,
  obtenerReservaController,
  agendaDelDiaController,
  informeReservasPorCategoriaController,
} from "../controller/reserva.controller.js";
import { authMiddleware, requireRole } from "../../middleware/auth.middleware.js";
import { middlewareValidateReservaBody, middlewareValidateReprogramarBody, middlewareValidateListarReservasQuery, middlewareValidateAgendaQuery } from "../../middleware/validateReserva.middleware.js";
import { Role } from "../../constants/role.constants.js";
import { validateParamsIdReservaMiddleware } from "../../middleware/params.middleware.js";
import { generarQrReservaController } from "../controller/api-externas.controller.js";

const turnosRoutes = Router();

turnosRoutes.use(authMiddleware);

turnosRoutes.get("/", middlewareValidateListarReservasQuery, listarReservas);
turnosRoutes.post("/", middlewareValidateReservaBody, reservarTurno);
// va antes de "/:idReserva" para que "agenda" no se tome como un id
turnosRoutes.get("/agenda", requireRole(Role.admin), middlewareValidateAgendaQuery, agendaDelDiaController);
turnosRoutes.get("/informes/categorias", requireRole(Role.admin),informeReservasPorCategoriaController);
turnosRoutes.patch("/:idReserva", validateParamsIdReservaMiddleware, middlewareValidateReprogramarBody, reprogramarReservaController);
turnosRoutes.delete("/:idReserva", validateParamsIdReservaMiddleware, cancelarReservaController);
turnosRoutes.get("/:idReserva/qr", validateParamsIdReservaMiddleware, generarQrReservaController);
turnosRoutes.get("/:idReserva", validateParamsIdReservaMiddleware, obtenerReservaController);


export default turnosRoutes;
