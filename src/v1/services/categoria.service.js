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

// no se borra si alguna reserva la usa, para que no queden reservas apuntando a una categoría que no existe
export const eliminarCategoria = async (id) => {
    const tieneReservas = await Reserva.exists({ categoriaId: id });

    if (tieneReservas) {
        throw new AppError(409, "No se puede eliminar la categoría porque tiene reservas asociadas.");
    }

    const categoria = await Categoria.findByIdAndDelete(id);

    if (!categoria) {
        throw new AppError(404, "La categoría no existe.");
    }

    return categoria;
};
