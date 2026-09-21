import Joi from "joi";

// esquema de validación para el cuerpo de la solicitud de edición de usuario
export const updateUserBodySchema = Joi.object({
    name: Joi.string().min(3).max(30).label("nombre"),
    username: Joi.string().alphanum().min(3).lowercase(),
    email: Joi.string().email().lowercase(),
}).min(1);
