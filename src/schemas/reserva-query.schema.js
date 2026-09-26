import Joi from "joi";

// Sin pagina ni limite, la lista se devuelve completa.
// Si viene uno de los dos, el controlador completa el otro con su valor por defecto.
export const listarReservasQuerySchema = Joi.object({
    pagina: Joi.number().integer().min(1),
    limite: Joi.number().integer().min(1).max(100),
});
