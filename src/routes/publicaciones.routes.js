import express from "express";
import * as publicacionesControllers from "../controllers/publicaciones.controllers.js";
import validateBody from "../middlewares/validateBody.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

// CREAR UNA NUEVA PUBLICACIÓN
router.post(
    "/",
    validateBody,
    verifyToken,
    publicacionesControllers.crearPublicacion,
);

// OBTENER TODAS LAS PUBLICACIONES
router.get("/", publicacionesControllers.obtenerPublicaciones);

// OBTENER UNA PUBLICACIÓN POR ID
router.get("/:id", publicacionesControllers.obtenerPublicacionPorId);

// ACTUALIZAR UNA PUBLICACIÓN
router.put(
    "/:id",
    validateBody,
    verifyToken,
    publicacionesControllers.actualizarPublicacion,
);

// ELIMINAR UNA PUBLICACIÓN
router.delete(
    "/:id",
    verifyToken,
    publicacionesControllers.eliminarPublicacion,
);

export default router;
