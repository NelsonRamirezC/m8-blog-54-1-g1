import Usuario from "../models/Usuario.model.js";
import sequelize from "../config/database.js";

export const registro = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        let { nombre, email, password } = req.body;

        if (!nombre || !email || !password) {
            await t.rollback();
            return res.status(400).json({
                status: "fail",
                message:
                    "No se proporcion los campos requeridos: [nombre, email, password]",
            });
        }

        //CREACIÓN DE USUARIOS

        const usuarioDb = await Usuario.findOne({ where: { email }, transaction: t });

        //SI EXISTE EL USUARIO EN LA BASE DE DATOS
        if (usuarioDb) {
            await t.rollback();
            return res
                .status(400)
                .json({
                    status: "fail",
                    message: `Ya existe un usuario con el email: ${email}, intente recupera su password o debe ponerse en contacto con el administrador: soporte@admin.com`,
                });
        }

        let usuario = await Usuario.create(
            { nombre, email, password },
            { transaction:t },
        );

        usuario = usuario.toJSON();
        delete usuario.password;
        delete usuario.status;
        delete usuario.admin;


        await t.commit();
        res.status(201).json({ status: "success", message: "Registro ok", usuario });
    } catch (error) {
        console.log(error);
        await t.rollback();
        res.status(500).json({
            status: "error",
            message: "Error interno del servidor.",
        });
    }
};

export const login = async (req, res) => {
    try {
        res.json({ status: "success", message: "Login" });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error interno del servidor.",
        });
    }
};
