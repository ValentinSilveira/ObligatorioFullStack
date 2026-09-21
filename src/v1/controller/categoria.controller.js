import {
    crearCategoria, getAllCategorias, getCategoriaByIdService,
    updateCategoria, eliminarCategoria
} from "../services/categoria.service.js";

// listamos todas las categorías
export const listarCategorias = async (req, res) => {
    const categorias = await getAllCategorias();
    return res.status(200).json(categorias);
};

// vemos una categoría puntual
export const getCategoria = async (req, res) => {
    const { idCategoria } = req.params;
    const categoria = await getCategoriaByIdService(idCategoria);
    return res.status(200).json(categoria);
};

// creamos una categoría nueva
export const createCategoriaController = async (req, res) => {
    const { nombre, descripcion } = req.body;
    const categoria = await crearCategoria(nombre, descripcion);
    return res.status(201).json({
        message: "Categoría creada con éxito.",
        categoria
    });
};

// editamos una categoría existente
export const updateCategoriaController = async (req, res) => {
    const { idCategoria } = req.params;
    const categoria = await updateCategoria(idCategoria, req.body);
    return res.status(200).json({
        message: "Categoría actualizada con éxito.",
        categoria
    });
};

// eliminamos una categoría
export const deleteCategoriaController = async (req, res) => {
    const { idCategoria } = req.params;
    await eliminarCategoria(idCategoria);
    return res.status(204).send();
};
