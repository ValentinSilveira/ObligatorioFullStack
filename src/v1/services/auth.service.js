import { hashear } from "../../utils/validar-password.utils.js";
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