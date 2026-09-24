import { loginBodySchema } from "../schemas/login-body.schema.js";
import { registerBodySchema } from "../schemas/register-body.schema.js";
import { verifyAccessToken } from "../utils/token.utils.js";
import { validateRequest } from "./validate.middleware.js";
import { AppError } from "../utils/appError.js";
import { getUserByIdService } from "../v1/services/user.services.js";

export const middlewareValidateRegisterBody = validateRequest(registerBodySchema, "body");
export const middlewareValidateLoginBody = validateRequest(loginBodySchema, "body");

export const authMiddleware = (req, res, next) => {
    try {
        // 1. Obtener header
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).
                json({ error: "No se recibió ningún token." });
        }
        // 2. Sacar "Bearer "
        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(401).json({
                error: "Token no proporcionado"
            });
        }
        const token = authHeader.split(" ")[1];
        // 3. Verificar token
        const decoded = verifyAccessToken(token);
        // 4. Guardar datos en request
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ error: "El token expiró, iniciá sesión de nuevo." });
        }
        return res.status(401).json({ error: "Token inválido." });
    }
}


// Middleware para restringir rutas a ciertos roles (ej: solo admin).
// Consulta el rol actual en la base (no confía en el rol que pueda venir en el token),
// así se respeta cualquier cambio de rol posterior al login.
export const requireRole = (...rolesPermitidos) => async (req, res, next) => {
    try {
        const user = await getUserByIdService(req.user.id);

        if (!rolesPermitidos.includes(user.role)) {
            throw new AppError(403, "No tenés permisos para realizar esta acción.");
        }

        next();
    } catch (error) {
        next(error);
    }
};