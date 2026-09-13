import { Router } from "express"
import { createUserController, deleteUserController, replaceUserController, updateUserController } from "../controller/user.controller.js"



const userRoutes = Router();


//TODO: crear controllers correspondientes
userRoutes.post("/", createUserController);
userRoutes.delete("/:idUser", deleteUserController);


userRoutes.patch("/:idUser", updateUserController);
userRoutes.put("/:idUser", replaceUserController);

// TODO: ver si puede borrar esas rutas ya que usamos las de auth

export default userRoutes