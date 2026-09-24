import { AppError } from "../../utils/appError.js";
import { compararPassword, hashear } from "../../utils/validar-password.utils.js";
import User from "../models/user.model.js";
import { getUserByEmail, getUserByUsername } from "./user.services.js";


export const getUserByEmailOrUsername = async (data) => {
    return await User.findOne({
        $or: [
            { email: data },
            { username: data }
        ]
    }).select("+password");
}

//data es un usuario completo
export const createUserService = async (data) => {
    const email = data.email;
    const userPorEmail = await getUserByEmail(email);
    if (userPorEmail) {
        throw new AppError(409, "Ese email ya está en uso.");
    }
    const username = data.username;
    const userPorUsername = await getUserByUsername(username);
    if (userPorUsername) {
        throw new AppError(409, "Ese username ya está en uso.");
    }

    // Se arma el objeto explícitamente para que un registro
    // nunca pueda colarse con un "role" propio: siempre queda el default ("user") del modelo.
    const userData = {
        name: data.name,
        username: data.username,
        email: data.email,
        plan: data.plan,
        password: await hashear(data.password)
    };

    try {
        const user = await User.create(userData);
        return user;
    } catch (error) {
        if (error.code === 11000) {
            throw new AppError(409, "Ese email o username ya está en uso.");
        }
        throw error;
    }
}

export const registerService = async (reqBody) => {
    //poner lo que esta en el controller aca
}

export const loginService = async (reqBody) => {
    const errorCredencialInvalida = new AppError(401, "Credenciales invalidas");

    if (!reqBody) {
        throw errorCredencialInvalida;
    }
    const emailOUsername = reqBody.identificador;

    //valida que exita usuario en la base, obtener el usuario por el email
    const user = await getUserByEmailOrUsername(emailOUsername);

    if (!user) {
        throw errorCredencialInvalida;
    }

    const passwordParam = reqBody.password;
    const passwordBase = user.password;

    const valid = await compararPassword(passwordParam, passwordBase);

    //si no valida error
    if (!valid) {
        throw errorCredencialInvalida;
    }
    return user;
}