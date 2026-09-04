import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.model.js";

const verifyToken = async (req, res, next) => {
    try {
        if (!req.headers || !req.headers.authorization) {
            return res
                .status(401)
                .json({ status: "fail", message: "No se proporcionar token." });
        }

        const token = req.headers.authorization.split(" ")[1];

        let decoded = jwt.verify(token, "secret");

        const usuario = await Usuario.findByPk(decoded.id, {
            attributes: ["id", "nombre", "email", "admin", "status"],
        });

        if (!usuario) {
            return res.status(404).json({
                status: "fail",
                message: "El usuario del token no existe.",
            });
        }

        //USAMOS LOS DATOS ACTUALIZADOS
        req.usuario = usuario;

        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            status: "fail",
            message: "token caducado o inválido, vuelva a iniciar sesión",
        });
    }
};

export default verifyToken;
