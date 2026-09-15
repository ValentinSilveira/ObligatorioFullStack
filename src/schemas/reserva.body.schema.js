import joi from "joi";

export const reservaBodySchema = joi.object({
    fecha: joi.date().iso().required(),
    hora: joi.string().pattern(/^(?:[01]\d|2[0-3]):[0-5]\d$/).required(),
    mascota: joi.string().min(1).max(50).required(),
    nombreMascota: joi.string().min(1).max(50).required(),
    edadMascota: joi.number().integer().min(0).max(100).required(),
    motivo: joi.string().min(1).max(200).required(),
});

export const reprogramarBodySchema = joi.object({
    nuevaFecha: joi.date().iso().required(),
    nuevaHora: joi.string().pattern(/^(?:[01]\d|2[0-3]):[0-5]\d$/).required(),
});
