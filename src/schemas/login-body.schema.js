import Joi from 'joi';

export const loginBodySchema = Joi.object({
    password: Joi.string().min(3).max(30).required(),
    identificador: Joi.alternatives().try(
        Joi.string().email(),
        Joi.string().alphanum().min(3)
    ).required(),
})
