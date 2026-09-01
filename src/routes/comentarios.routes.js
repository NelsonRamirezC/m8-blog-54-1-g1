import express from "express";
import * as comentariosControllers from "../controllers/comentarios.controllers.js";
import validateBody from "../middlewares/validateBody.js";

const router = express.Router();

// CREAR UN NUEVO COMENTARIO
router.post("/", validateBody, comentariosControllers.crearComentario);

// OBTENER TODOS LOS COMENTARIOS
router.get("/", comentariosControllers.obtenerComentarios);

// OBTENER COMENTARIOS DE UNA PUBLICACIÓN ESPECÍFICA
router.get(
    "/publicacion/:publicacionId",
    comentariosControllers.obtenerComentariosPorPublicacion,
);

// OBTENER UN COMENTARIO POR ID
router.get("/:id", comentariosControllers.obtenerComentarioPorId);

// ACTUALIZAR UN COMENTARIO
router.put("/:id", validateBody, comentariosControllers.actualizarComentario);

// ELIMINAR UN COMENTARIO
router.delete("/:id", comentariosControllers.eliminarComentario);

export default router;
