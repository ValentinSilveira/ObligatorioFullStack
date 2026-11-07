import mongoose from "mongoose";
import Categoria from "../models/categoria.model.js";
import Reserva from "../models/reserva.model.js";
import { AppError } from "../../utils/appError.js";

export const crearCategoria = async (nombre, descripcion) => {
    try {
        return await Categoria.create({ nombre, descripcion });
    } catch (error) {
        if (error.code === 11000) {
            throw new AppError(409, "Ya existe una categoría con ese nombre.");
        }
        throw error;
    }
};

export const getAllCategorias = async () => {
    return await Categoria.find();
};

export const getCategoriaByIdService = async (id) => {
    const categoria = await Categoria.findById(id);

    if (!categoria) {
        throw new AppError(404, "La categoría no existe.");
    }

    return categoria;
};

export const updateCategoria = async (id, data) => {
    try {
        const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true, runValidators: true });

        if (!categoria) {
            throw new AppError(404, "La categoría no existe.");
        }

        return categoria;
    } catch (error) {
        if (error.code === 11000) {
            throw new AppError(409, "Ya existe una categoría con ese nombre.");
        }
        throw error;
    }
};

// Elimina la categoría solo si ninguna reserva la usa. Va en transacción porque crearReserva
// escribe el documento de la categoría: si ambas operaciones corren a la vez, una entra en
// conflicto y se reintenta, así nunca queda una reserva apuntando a una categoría borrada.
export const eliminarCategoria = async (id) => {
    const session = await mongoose.startSession();
    let categoriaEliminada;
    try {
        await session.withTransaction(async () => {
            const tieneReservas = await Reserva.exists({ categoriaId: id }).session(session);
            if (tieneReservas) {
                throw new AppError(409, "No se puede eliminar la categoría porque tiene reservas asociadas.");
            }

            const categoria = await Categoria.findByIdAndDelete(id, { session });
            if (!categoria) {
                throw new AppError(404, "La categoría no existe.");
            }
            categoriaEliminada = categoria;
        });
        return categoriaEliminada;
    } finally {
        await session.endSession();
    }
};
