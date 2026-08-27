import express from "express";
import  * as authControllers from "../controllers/auth.controllers.js";
import validateBody from "../middlewares/validateBody.js";

const router = express.Router();


//REGISTRAR UN NUEVO USUARIO
router.post("/registro", validateBody, authControllers.registro);


//LOGIN DE USUARIOS
router.post("/login", validateBody, authControllers.login);


export default router;