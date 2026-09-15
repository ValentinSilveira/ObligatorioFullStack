export const middlewareErrores = (err, req, res, next) => {
    if (err.isJoi) {
        return res.status(400).json({
            message: 'Datos inválidos',
            errors: err.details.map((detail) => ({
                field: detail.path.join('.'),
                message: detail.message
            }))
        });
    }

    return res.status(err.statusCode || 500).json({
        message: err.message || 'Error interno del servidor'
    });
};