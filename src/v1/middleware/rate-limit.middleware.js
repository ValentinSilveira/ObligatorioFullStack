import rateLimit from "express-rate-limit";

export const apiRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Demasiadas solicitudes, intentá de nuevo más tarde." }
});

export const loginRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    message: { message: "Demasiados intentos de inicio de sesión. Probá de nuevo en unos minutos." }
});
