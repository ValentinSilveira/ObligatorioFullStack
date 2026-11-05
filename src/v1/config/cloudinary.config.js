import { v2 as cloudinary } from "cloudinary";

const config = {
    cloud_name: process.env.CLOUD_NAME?.trim(),
    api_key: process.env.CLOUD_API_KEY?.trim(),
    api_secret: process.env.CLOUD_API_SECRET?.trim(),
};

// Diagnóstico seguro: no imprime el secret.
console.log("Configuración Cloudinary:", {
    cloud_name: config.cloud_name,
    api_key: config.api_key,
    secretCargado: Boolean(config.api_secret),
    folder: process.env.CLOUD_FOLDER?.trim(),
});

if (!config.cloud_name || !config.api_key || !config.api_secret) {
    console.error("Falta una variable de configuración de Cloudinary en el .env");
}

cloudinary.config(config);

export default cloudinary;