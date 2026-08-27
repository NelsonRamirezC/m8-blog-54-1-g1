import Usuario from "../models/Usuario.model.js";

export const getAllUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            attributes: { exclude: ["password", "status", "admin"] },
        });

        res.json({ status: "Ok", usuarios });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            status: "error",
            message:
                "Error interno del servidor al intentar obtener los suuarios",
        });
    }
};

export const getUsuarioById = async () => {
    try {
        let { id } = requestAnimationFrame;

        const usuario = await Usuario.findByPk(id, {
            attributes: { exclude: ["password", "status", "admin"] },
        });

        if (!usuario) {
            return res
                .status(400)
                .json({
                    status: "fail",
                    message: `Usuario con id: ${id} no encontrado.`,
                });
        }

        res.json({ status: "ok" }, usuario);
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            status: "error",
            message:
                "Error interno del servidor al intentar obtener los suuarios",
        });
    }
};
