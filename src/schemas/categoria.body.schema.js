import joi from "joi";

// esquema de validación para el cuerpo de la solicitud de creación de categoría
export const categoriaBodySchema = joi.object({
    nombre: joi.string().required(),
    descripcion: joi.string().min(1).max(300).required(),
});

// esquema de validación para el cuerpo de la solicitud de edición de categoría
export const editarCategoriaBodySchema = joi.object({
    nombre: joi.string(),
    descripcion: joi.string().min(1).max(300),
}).min(1);
