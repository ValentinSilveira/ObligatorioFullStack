import { createImage, deleteImage } from "../services/image.service.js";

export const uploadImageBase64 = async (req, res) => {
    try {
        const { file } = req.body ?? {};

        if (!file) {
            return res.status(400).json({
                error: "No se recibió la imagen en el campo 'file'.",
            });
        }

        const resultado = await createImage(file);

        return res.status(200).json({
            secure_url: resultado.secure_url,
            public_id: resultado.public_id,
        });
    } catch (error) {
        // Muestra el error en la terminal del backend, sin exponer credenciales.
        console.error("Error al subir a Cloudinary:", {
            message: error.message,
            http_code: error.http_code,
            name: error.name,
            cloudinaryMessage: error.error?.message,
        });

        return res.status(error.http_code || 500).json({
            error: error.error?.message || error.message || "Error al subir la imagen",
            http_code: error.http_code || 500,
        });
    }
};

export const removeImage = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await deleteImage(id);

        return res.status(200).json({
            message: "Imagen eliminada correctamente.",
            resultado,
        });
    } catch (error) {
        console.error("Error al eliminar de Cloudinary:", {
            message: error.message,
            http_code: error.http_code,
            name: error.name,
            cloudinaryMessage: error.error?.message,
        });

        return res.status(error.http_code || 500).json({
            error: error.error?.message || error.message || "Error al eliminar la imagen",
            http_code: error.http_code || 500,
        });
    }
};