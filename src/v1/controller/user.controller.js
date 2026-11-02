import { deleteUserService, updatePlanService, updateUserService, getUserByIdService, getClientesService } from "../services/user.services.js";

// listamos todos los clientes (solo admin)
export const listarClientesController = async (req, res) => {
    const clientes = await getClientesService();
    return res.status(200).json(clientes);
};

export const getUserController = async (req, res) => {
    const user = await getUserByIdService(req.user.id);
    return res.status(200).json(user);
};

export const updateUserController = async (req, res) => {
    const data = req.body;
    const user = await updateUserService(req.user.id, data);
    return res.status(200).json(user);
};

export const deleteUserController = async (req, res) => {
    await deleteUserService(req.user.id);
    return res.status(204).send();
};

export const updatePlanController = async (req, res) => {
    const { plan } = req.body;
    const user = await updatePlanService(req.user.id, plan);
    return res.status(200).json({
        message: "Plan actualizado con éxito.",
        user
    });
};
