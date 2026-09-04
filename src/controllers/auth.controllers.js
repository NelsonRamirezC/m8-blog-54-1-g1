import Usuario from "../models/Usuario.model.js";
import sequelize from "../config/database.js";
import { generarHash, decodificarHash } from "../utils/hash.js";
import jwt from "jsonwebtoken";

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

        //procesar imágen si es que existe
        let imagenAvatar = null;
        let mimetype = null;

        if(req.files && req.files.avatar){

            const file = req.files.avatar;

            const formatosPermitidos = ["image/jpg", "image/jpeg", "image/webp"];

            if(!formatosPermitidos.includes(file.mimetype)){
                await t.rollback();
                return res.status(400).json({status: "fail", message: "Formato de imagen no permitido, sólo se permiten imágenes de los siguientes formatos: [jpg, jpeg, webp]."});
            };

            const maxSize = 3 * 1024 * 1024; // 3 MBs

            if(file.size > maxSize){
                await t.rollback();
                return res.status(400).json({status: "fail", message: "La imagen sobrepasa el límite de 3 Mbs permitidos."});
            }

            imagenAvatar = file.data;
            mimetype = file.mimetype;
        }

        //CREACIÓN DE USUARIOS

        const usuarioDb = await Usuario.findOne({
            where: { email },
            transaction: t,
        });

        //SI EXISTE EL USUARIO EN LA BASE DE DATOS
        if (usuarioDb) {
            await t.rollback();
            return res.status(400).json({
                status: "fail",
                message: `Ya existe un usuario con el email: ${email}, intente recupera su password o debe ponerse en contacto con el administrador: soporte@admin.com`,
            });
        }

        let usuario = await Usuario.create(
            { nombre, email, password, imagenAvatar, mimetype },
            { transaction: t },
        );

        usuario = usuario.toJSON();
        delete usuario.password;
        delete usuario.status;
        delete usuario.admin;
        delete usuario.imagenAvatar;
        delete usuario.mimetype;

        await t.commit();
        res.status(201).json({
            status: "success",
            message: "Registro ok",
            usuario,
        });
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
        let { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                status: "fail",
                message:
                    "No se proporcion los campos requeridos: [email, password]",
            });
        }

        const usuario = await Usuario.findOne({where: { email }});

        if (!usuario) {
            return res.status(400).json({
                status: "fail",
                message: `Credenciales inválidas.`,
            });
        }

        let validPassword = decodificarHash(password, usuario.password)

        if (!validPassword) {
            return res.status(400).json({
                status: "fail",
                message: `Credenciales inválidas.`,
            });
        }

        const payload = {
            id: usuario.id,
            nombre: usuario.nombre,
            admin: usuario.admin,
            status: usuario.status
        }

        const token = jwt.sign(payload, 'secret', { expiresIn: '3m' });

        res.json({ status: "success", message: "Login Ok!", token });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "error",
            message: "Error interno del servidor.",
        });
    }
};
