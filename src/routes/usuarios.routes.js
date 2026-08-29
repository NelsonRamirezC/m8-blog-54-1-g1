import express from "express";
import * as usuariosControllers from "../controllers/usuarios.controllers.js";

import validateBody from "../middlewares/validateBody.js";

const router = express.Router();

//OBTENER TODOS LOS USUARIOS
router.get("/", usuariosControllers.getAllUsuarios);

//OBTENER USUARIOS POR ID
router.get("/:id", usuariosControllers.getUsuarioById);

//ACTUALIZAR USUARIOS POR ID
router.put("/:id", validateBody, usuariosControllers.updateUsuario);

//ELIMINAR USUARIOS POR ID
router.delete("/:id", usuariosControllers.deleteUsuarioById);

export default router;
