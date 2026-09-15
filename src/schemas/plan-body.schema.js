import Joi from "joi";

export const planBodySchema = Joi.object({
    plan: Joi.string().valid("plus", "premium").required(),
});
