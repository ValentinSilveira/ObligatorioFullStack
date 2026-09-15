import { reservaBodySchema, reprogramarBodySchema } from "../schemas/reserva.body.schema.js";
import { validateRequest } from "./validate.middleware.js";

export const middlewareValidateReservaBody = validateRequest(reservaBodySchema, "body");
export const middlewareValidateReprogramarBody = validateRequest(reprogramarBodySchema, "body");
