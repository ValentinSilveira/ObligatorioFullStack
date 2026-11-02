import Joi from "joi";

export const paramsIdReservaSchema = Joi.object({
    idReserva: Joi.string().pattern(/^[0-9a-fA-F]{24}$/)
})

export const paramsIdClienteSchema = Joi.object({
    idCliente: Joi.string().pattern(/^[0-9a-fA-F]{24}$/)
})
