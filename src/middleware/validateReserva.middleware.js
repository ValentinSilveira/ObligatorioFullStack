import { listarReservasQuerySchema } from "../schemas/reserva-query.schema.js";
import { reservaBodySchema, reprogramarBodySchema } from "../schemas/reserva.body.schema.js";
import { validateRequest } from "./validate.middleware.js";

export const middlewareValidateReservaBody = validateRequest(reservaBodySchema, "body");
export const middlewareValidateReprogramarBody = validateRequest(reprogramarBodySchema, "body");
export const middlewareValidateListarReservasQuery = validateRequest(listarReservasQuerySchema, "query");