import { mensajesJoi } from "../v1/config/joi-message.js";


export const validateRequest = (schema, reqKey) => {
    return (req, res, next) => {
        const objetoAValidar = req[reqKey];
        const { error, value } = schema.validate(objetoAValidar, {
            abortEarly: false,
            messages: mensajesJoi,
            errors: { //saca las doble comillas de los label
                wrap: {
                    label: false
                }
            }
        });

        if (error) {
            return next(error);
        }
        req[reqKey] = value;
        return next();
    }
}
