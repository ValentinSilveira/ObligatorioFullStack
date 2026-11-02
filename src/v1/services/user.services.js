import User from "../models/user.model.js";
import Reserva from "../models/reserva.model.js";
import { AppError } from "../../utils/appError.js";
import { Role } from "../../constants/role.constants.js";

// lista de clientes (usuarios con rol "user") para el admin, ordenados por nombre de usuario
export const getClientesService = async () => {
    return await User.find({ role: Role.user }).sort({ username: 1 });
};

// Verifica que el id sea de un cliente (así el admin no puede editar ni borrar a otro admin)
const asegurarCliente = async (idCliente) => {
    const user = await User.findById(idCliente);

    if (!user || user.role !== Role.user) {
        throw new AppError(404, "El cliente no existe.");
    }
};

// el admin edita nombre, username y email de un cliente (el plan no se toca)
export const updateClienteService = async (idCliente, data) => {
    await asegurarCliente(idCliente);
    return await updateUserService(idCliente, data);
};

// el admin borra un cliente y sus reservas, para que no queden reservas sin cliente en la agenda
export const deleteClienteService = async (idCliente) => {
    await asegurarCliente(idCliente);
    await Reserva.deleteMany({ cliente: idCliente });
    return await deleteUserService(idCliente);
};

export const getUserByIdService = async (id) => {
    const user = await User.findById(id);

    if (!user) {
        throw new AppError(404, "El usuario no existe.");
    }

    return user;
};

export const getUserByEmail = async (data) => {
    return await User.findOne({ email: data });
}

export const getUserByUsername = async (data) => {
    return await User.findOne({ username: data });
}

export const deleteUserService = async (id) => {
    const user = await User.findByIdAndDelete(id);

    if (!user) {
        throw new AppError(404, "El usuario no existe.");
    }

    return user;
};

export const updateUserService = async (id, data) => {
    try {
        const user = await User.findByIdAndUpdate(id, data, { new: true, runValidators: true });

        if (!user) {
            throw new AppError(404, "El usuario no existe.");
        }

        return user;
    } catch (error) {
        if (error.code === 11000) {
            throw new AppError(409, "Ese username o email ya está en uso.");
        }
        throw error;
    }
};

export const updatePlanService = async (id, plan) => {
    const user = await User.findByIdAndUpdate(id, { plan }, { new: true, runValidators: true });

    if (!user) {
        throw new AppError(404, "El usuario no existe.");
    }

    return user;
};
