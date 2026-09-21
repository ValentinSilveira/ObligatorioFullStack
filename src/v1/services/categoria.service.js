import Categoria from "../models/categoria.model.js";
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

export const eliminarCategoria = async (id) => {
    const categoria = await Categoria.findByIdAndDelete(id);

    if (!categoria) {
        throw new AppError(404, "La categoría no existe.");
    }

    return categoria;
};
