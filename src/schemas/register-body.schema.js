import Joi from 'joi';
import { Roles } from '../constants/role.constants.js';

//esquema de validacion para body registro
export const registerBodySchema = Joi.object({
    name: Joi.string().min(3).max(30).label("nombre").required(),
    username: Joi.string().alphanum().min(3).lowercase().required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(3).max(30).required(),
    confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
    role: Joi.string().valid(...Roles).required(),
    plan: Joi.string().valid("plus", "premium").required()
})

export const roleSchema = Joi.object({
    role: Joi.string().valid(...Roles).required()
})