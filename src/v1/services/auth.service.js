import { constructorError } from "../../utils/contructorError.js";
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
    //TODO: hay que validar que no existe un usuario con email ni username


    const email = data.email;
    const userPorEmail = await getUserByEmail(email);
    if (userPorEmail) {
        //TODO:  usar el constructor de errores
        throw new Error("Error el mail ya existe");
    }
    const username = data.username;
    const userPorUsername = await getUserByUsername(username);
    if (userPorUsername) {
        //TODO usar el constructor de errores
        throw new Error("Error el usuario ya existe");
    }

    const userData = {
        ...data,
        password: await hashear(data.password)
    };

    const user = await User.create(userData);
    return user;
}

export const registerService = async (reqBody) => {
    //poner lo que esta en el controller aca
}

export const loginService = async (reqBody) => {
    const errorCredencialInvalida = constructorError("Credenciales invalidas", 401);

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