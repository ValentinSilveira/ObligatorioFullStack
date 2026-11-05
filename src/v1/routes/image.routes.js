import { Router } from "express";
import {
    uploadImageBase64,
    removeImage,
} from "../controller/image.controller.js";

const imageRoutes = Router();

imageRoutes.post("/", uploadImageBase64);
imageRoutes.delete("/:id", removeImage);

export default imageRoutes; 