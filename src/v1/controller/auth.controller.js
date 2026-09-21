
import { createUserService, loginService } from "../services/auth.service.js";
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
    return res.status(201).json({
        user,
        token
    });
}

export const loginController = async (req, res) => {
    const dataBody = req.body;
    const user = await loginService(dataBody);

   const dataUser = {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email
    }
    const token = generateAccessToken(dataUser);
    return res.status(200).json({
        user,
        token
    });
}