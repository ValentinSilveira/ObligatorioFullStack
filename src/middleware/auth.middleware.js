import { loginBodySchema } from "../schemas/login-body.schema.js";
import { registerBodySchema } from "../schemas/register-body.schema.js";
import { verifyAccessToken } from "../utils/token.utils.js";
import { validateRequest } from "./validate.middleware.js";

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