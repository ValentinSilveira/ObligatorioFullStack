import { createUserService } from "../services/auth.service.js";
import { deleteUserService, replaceUserService } from "../services/user.services.js";



export const createUserController = async (req, res) => {
    const data = req.body;
    const user = await createUserService(data);
    return res.status(200).json(user);
}

export const deleteUserController = async (req, res) => {
    const { idUser } = req.params;
    await deleteUserService(idUser);
    return res.status(204).send();
}

export const updateUserController = async (req, res) => {
    const data = req.body;
    const { idUser } = req.params;
    const user = await updateUserService(idUser, data);
    return res.status(200).json(user);

}

export const replaceUserController = async (req, res) => {
    const data = req.body;
    const { idUser } = req.params;
    const user = await replaceUserService(idUser, data);
    return res.status(200).json(user);
}