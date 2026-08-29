import Usuario from "../models/Usuario.model.js";
import sequelize from "../config/database.js";

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
                "Error interno del servidor al intentar obtener los usuarios",
        });
    }
};

export const getUsuarioById = async (req, res) => {
    try {
        let { id } = req.params;

        const usuario = await Usuario.findByPk(id, {
            attributes: { exclude: ["password", "status", "admin"] },
        });

        if (!usuario) {
            return res.status(400).json({
                status: "fail",
                message: `Usuario con id: ${id} no encontrado.`,
            });
        }

        res.json({ status: "ok", usuario });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            status: "error",
            message:
                "Error interno del servidor al intentar obtener los suuarios",
        });
    }
};

export const updateUsuario = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        let { id } = req.params;
        let { nombre, email, password } = req.body;

        if (!nombre || !email || !password || isNaN(id)) {
            await t.rollback();
            return res.status(400).json({
                status: "fail",
                message:
                    "No se proporcion los campos requeridos o tienen formatos inválidos: [id, nombre, email, password]",
            });
        }

        let usuario = await Usuario.findByPk(id, {
            attributes: ["id", "nombre", "email"],
            transaction: t
        });

        if (!usuario) {
            await t.rollback();
            return res.status(400).json({
                status: "fail",
                message: `Usuario con id: ${id} no encontrado.`,
            });
        }

        await usuario.update(
            { nombre, email, password }, 
            { 
                transaction: t,
            }
        );

        usuario = usuario.toJSON();
        delete usuario.password;

        await t.commit();
        res.json({ status: "ok", message: "Usuario actualizado con éxito", usuario });
    } catch (error) {
        await t.rollback();
        console.log(error);
        return res.status(400).json({
            status: "error",
            message:
                "Error interno del servidor al intentar obtener los suuarios",
        });
    }
};

