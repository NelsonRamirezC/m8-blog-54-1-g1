import Usuario from "../models/Usuario.model.js";
import sequelize from "../config/database.js";

export const getAllUsuarios = async (req, res) => {
    try {
        const { offset, limit, sortBy, orderType } = req.query;

        // 1. Sanitizar paginación con valores por defecto y límites mínimos
        const parsedOffset = Math.max(0, parseInt(offset, 10) || 0);
        const parsedLimit = Math.max(1, parseInt(limit, 10) || 10);

        // 2. Validar y construir ordenamiento seguro (lista blanca contra inyección SQL)
        const allowedSortFields = ["id", "nombre", "email"];
        let order;

        if (sortBy && allowedSortFields.includes(sortBy)) {
            const direction =
                orderType?.trim().toUpperCase() === "DESC" ? "DESC" : "ASC";
            order = [[sortBy, direction]];
        }

        // 3. Consulta a la base de datos
        const { count, rows } = await Usuario.findAndCountAll({
            attributes: { exclude: ["password", "status", "admin", "imagenAvatar", "mimetype"] },
            offset: parsedOffset,
            limit: parsedLimit,
            order,
        });


        const usuarios = rows.map(u => {
            u = u.toJSON();
            u.urlImagen = `/api/usuarios/${u.id}/avatar`;
            return u;
        })

        return res.json({
            status: "Ok",
            data: {
                cantidad: count,
                usuarios
            },
        });
    } catch (error) {
        console.error("Error en getAllUsuarios:", error);
        return res.status(500).json({
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
            attributes: { exclude: ["password", "status", "admin", "imagenAvatar", "mimetype"] },
        });

        if (!usuario) {
            return res.status(404).json({
                status: "fail",
                message: `Usuario con id: ${id} no encontrado.`,
            });
        }

        res.json({ status: "ok", usuario });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "error",
            message:
                "Error interno del servidor al intentar obtener el usuario por id.",
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
            transaction: t,
        });

        if (!usuario) {
            await t.rollback();
            return res.status(404).json({
                status: "fail",
                message: `Usuario con id: ${id} no encontrado.`,
            });
        }

        await usuario.update(
            { nombre, email, password },
            {
                transaction: t,
            },
        );

        usuario = usuario.toJSON();
        delete usuario.password;

        await t.commit();
        res.status(201).json({
            status: "ok",
            message: "Usuario actualizado con éxito",
            usuario,
        });
    } catch (error) {
        await t.rollback();
        console.log(error);
        return res.status(500).json({
            status: "error",
            message:
                "Error interno del servidor al intentar actualizar el usuario.",
        });
    }
};

export const deleteUsuarioById = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        let { id } = req.params;

        const usuario = await Usuario.findByPk(id, {
            attributes: ["id", "nombre", "email"],
            transaction: t,
        });

        if (!usuario) {
            await t.rollback();
            return res.status(404).json({
                status: "fail",
                message: `Usuario con id: ${id} no encontrado.`,
            });
        }

        await usuario.destroy({ transaction: t });

        await t.commit();
        res.json({
            status: "ok",
            message: `Usuario ${usuario.nombre} eliminado con éxito.`,
        });
    } catch (error) {
        await t.rollback();
        console.log(error);
        return res.status(500).json({
            status: "error",
            message:
                "Error interno del servidor al intentar eliminar al usuario",
        });
    }
};


export const getAvatarById = async (req, res) => {
    try {
        
        let { id } = req.params;

        const usuario = await Usuario.findByPk(id, {
            attributes: ["imagenAvatar", "mimetype"]
        });

        if (!usuario) {
            return res.status(404).json({
                status: "fail",
                message: `Usuario con id: ${id} no encontrado.`,
            });
        }

        //DEVOLVER LA IMAGEN SI ES QUE EXISTE

        if(!usuario.imagenAvatar || !usuario.mimetype){
            return res.status(404).json({
                status: "Not found",
                message: "El usuario no tiene avatar asignado"
            })
        }

        //CONFIGURAR LOS HEADERS PARA LA RESPUESTA
        res.set("Content-Type", usuario.mimetype);
        res.set("Cache-Control", "public, nax-age=3600");
        res.send(usuario.imagenAvatar);

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "error",
            message:
                "Error interno del servidor al intentar obtener el avatar del usuario",
        });
    }

}