import { Router } from "express";
import {
    uploadImageBase64,
    removeImage,
} from "../controller/image.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const imageRoutes = Router();

imageRoutes.use(authMiddleware);

imageRoutes.post("/", uploadImageBase64);
imageRoutes.delete("/:id", removeImage);

export default imageRoutes; 