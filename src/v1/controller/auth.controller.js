import { compararPassword } from "../../utils/validar-password.utils.js";
import { createUserService, getUserByEmailOrUsername } from "../services/auth.service.js";
import { generateAccessToken } from "../../utils/token.utils.js";


export const registerController = async (req, res) => {
    const data = req.body;
    const user = await createUserService(data);

    const userToken = {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email
    }
    const token = generateAccessToken(userToken);
    //devolvemos user y token
    return res.status(201).json({
        user,
        token
    });
}

export const loginController = async (req, res) => {
    const userLogin = req.body

    if (!userLogin) {
        return res.status(401).json({ message: "Credenciales invalidas" });
    }

    //valida que exista usuario en la base, obtener el usuario por el email
    const emailOrUsername = userLogin.identificador;
    const user = await getUserByEmailOrUsername(emailOrUsername);

    if (!user) {
        return res.status(401).json({ message: "Credenciales invalidas" });
    }

    //validar password pasado por data con el password del usuario recuperado
    const passwordParam = userLogin.password;
    const passwordBase = user.password;
    const valid = await compararPassword(passwordParam, passwordBase);

    if (!valid) {
        return res.status(401).json({ message: "Credenciales invalidas" });
    }

   const data = {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email
    }
    const token = generateAccessToken(data);

    return res.status(200).json({
        user,
        token
    });
}