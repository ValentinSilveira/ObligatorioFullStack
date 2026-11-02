import { paramsIdReservaSchema, paramsIdClienteSchema } from "../schemas/params.schema.js";
import { validateRequest } from "./validate.middleware.js";



export const validateParamsIdReservaMiddleware = validateRequest(paramsIdReservaSchema, "params");
export const validateParamsIdClienteMiddleware = validateRequest(paramsIdClienteSchema, "params");
