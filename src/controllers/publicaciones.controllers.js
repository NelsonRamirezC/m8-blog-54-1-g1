import Publicacion from "../models/Publicacion.model.js";
import Usuario from "../models/Usuario.model.js";
import Comentario from "../models/Comentario.model.js";
import sequelize from "../config/database.js";

// CREAR UNA NUEVA PUBLICACIÓN
export const crearPublicacion = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { titulo, contenido } = req.body;

        if (!titulo || !contenido) {
            await t.rollback();
            return res.status(400).json({
                status: "fail",
                message:
                    "No se proporcionaron los campos requeridos: [titulo, contenido ]",
            });
        }

        const usuarioId = req.usuario.id;

        const publicacion = await Publicacion.create(
            { titulo, contenido, usuarioId },
            { transaction: t },
        );

        await t.commit();
        res.status(201).json({
            status: "success",
            message: "Publicación creada exitosamente",
            publicacion,
        });
    } catch (error) {
        console.log(error);
        await t.rollback();
        res.status(500).json({
            status: "error",
            message: "Error interno del servidor",
        });
    }
};

// OBTENER TODAS LAS PUBLICACIONES
export const obtenerPublicaciones = async (req, res) => {
    try {
        const publicaciones = await Publicacion.findAll({
            include: [
                {
                    model: Usuario,
                    attributes: ["id", "nombre", "email"],
                },
            ],
            order: [["fechaCreacion", "DESC"]],
        });

        res.json({
            status: "success",
            message: "Publicaciones obtenidas exitosamente",
            publicaciones,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "error",
            message: "Error interno del servidor",
        });
    }
};

// OBTENER UNA PUBLICACIÓN POR ID
export const obtenerPublicacionPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const publicacion = await Publicacion.findByPk(id, {
            include: [
                {
                    model: Usuario,
                    attributes: ["id", "nombre", "email"],
                },
                {
                    model: Comentario,
                    attributes: [
                        "id",
                        "usuarioId",
                        "contenido",
                        "fechaCreacion",
                    ],
                    include: [
                        {
                            model: Usuario,
                            attributes: ["id", "nombre", "email"],
                        },
                    ],
                },
            ],
        });

        if (!publicacion) {
            return res.status(404).json({
                status: "fail",
                message: "La publicación no existe",
            });
        }

        res.json({
            status: "success",
            message: "Publicación obtenida exitosamente",
            publicacion,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "error",
            message: "Error interno del servidor",
        });
    }
};

// ACTUALIZAR UNA PUBLICACIÓN
export const actualizarPublicacion = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;
        const { titulo, contenido } = req.body;

        const publicacion = await Publicacion.findByPk(id, { transaction: t });
        if (!publicacion) {
            await t.rollback();
            return res.status(404).json({
                status: "fail",
                message: "La publicación no existe",
            });
        }

        //VERIFICAR SI USARIO AUTENTICADO ES EL AUTOR DE LA PUBLICACIÓN O ES ADMIN

        if (!req.usuario.admin) {
            if (req.usuario.id != publicacion.usuarioId) {
                await t.rollback();
                return res.status(403).json({
                    status: "fail",
                    message: "Usted no tiene permisos para editar esta publicación.",
                });
            }
        }

        if (titulo) publicacion.titulo = titulo;
        if (contenido) publicacion.contenido = contenido;

        await publicacion.save({ transaction: t });
        await t.commit();

        res.json({
            status: "success",
            message: "Publicación actualizada exitosamente",
            publicacion,
        });
    } catch (error) {
        console.log(error);
        await t.rollback();
        res.status(500).json({
            status: "error",
            message: "Error interno del servidor",
        });
    }
};

// ELIMINAR UNA PUBLICACIÓN
export const eliminarPublicacion = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;

        const publicacion = await Publicacion.findByPk(id, { transaction: t });
        if (!publicacion) {
            await t.rollback();
            return res.status(404).json({
                status: "fail",
                message: "La publicación no existe",
            });
        }

        await publicacion.destroy({ transaction: t });
        await t.commit();

        res.json({
            status: "success",
            message: "Publicación eliminada exitosamente",
        });
    } catch (error) {
        console.log(error);
        await t.rollback();
        res.status(500).json({
            status: "error",
            message: "Error interno del servidor",
        });
    }
};
