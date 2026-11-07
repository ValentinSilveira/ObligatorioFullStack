import { deleteCuentaService, updatePlanService, updateUserService, getUserByIdService, getClientesService, updateClienteService, deleteClienteService } from "../services/user.services.js";

// listamos todos los clientes (solo admin)
export const listarClientesController = async (req, res) => {
    const clientes = await getClientesService();
    return res.status(200).json(clientes);
};

// editamos nombre, username y email de un cliente (solo admin)
export const actualizarClienteController = async (req, res) => {
    const { idCliente } = req.params;
    const cliente = await updateClienteService(idCliente, req.body);
    return res.status(200).json({
        message: "Cliente actualizado con éxito.",
        cliente
    });
};

// eliminamos un cliente y sus reservas (solo admin)
export const eliminarClienteController = async (req, res) => {
    const { idCliente } = req.params;
    const cliente = await deleteClienteService(idCliente);
    return res.status(200).json({
        message: "Cliente eliminado con éxito.",
        cliente
    });
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
    await deleteCuentaService(req.user.id);
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
