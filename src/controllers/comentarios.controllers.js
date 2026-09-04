import Comentario from "../models/Comentario.model.js";
import Publicacion from "../models/Publicacion.model.js";
import Usuario from "../models/Usuario.model.js";
import sequelize from "../config/database.js";

// CREAR UN NUEVO COMENTARIO
export const crearComentario = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { contenido, publicacionId } = req.body;

        if (!contenido || !publicacionId ) {
            await t.rollback();
            return res.status(400).json({
                status: "fail",
                message:
                    "No se proporcionaron los campos requeridos: [contenido, publicacionId]",
            });
        }

        // Verificar que la publicación existe
        const publicacion = await Publicacion.findByPk(publicacionId, {
            transaction: t,
        });
        if (!publicacion) {
            await t.rollback();
            return res.status(404).json({
                status: "fail",
                message: "La publicación no existe",
            });
        }

        const usuarioId = req.usuario.id;

        const comentario = await Comentario.create(
            { contenido, publicacionId, usuarioId },
            { transaction: t },
        );

        await t.commit();
        res.status(201).json({
            status: "success",
            message: "Comentario creado exitosamente",
            comentario,
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

// OBTENER TODOS LOS COMENTARIOS
export const obtenerComentarios = async (req, res) => {
    try {
        const comentarios = await Comentario.findAll({
            include: [
                {
                    model: Usuario,
                    attributes: ["id", "nombre", "email"],
                },
                {
                    model: Publicacion,
                    attributes: ["id", "titulo"],
                },
            ],
            order: [["fechaCreacion", "DESC"]],
        });

        res.json({
            status: "success",
            message: "Comentarios obtenidos exitosamente",
            comentarios,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "error",
            message: "Error interno del servidor",
        });
    }
};

// OBTENER COMENTARIOS DE UNA PUBLICACIÓN ESPECÍFICA
export const obtenerComentariosPorPublicacion = async (req, res) => {
    try {
        const { publicacionId } = req.params;

        // Verificar que la publicación existe
        const publicacion = await Publicacion.findByPk(publicacionId);
        if (!publicacion) {
            return res.status(404).json({
                status: "fail",
                message: "La publicación no existe",
            });
        }

        const comentarios = await Comentario.findAll({
            where: { publicacionId },
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
            message: "Comentarios obtenidos exitosamente",
            comentarios,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "error",
            message: "Error interno del servidor",
        });
    }
};

// OBTENER UN COMENTARIO POR ID
export const obtenerComentarioPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const comentario = await Comentario.findByPk(id, {
            include: [
                {
                    model: Usuario,
                    attributes: ["id", "nombre", "email"],
                },
                {
                    model: Publicacion,
                    attributes: ["id", "titulo"],
                },
            ],
        });

        if (!comentario) {
            return res.status(404).json({
                status: "fail",
                message: "El comentario no existe",
            });
        }

        res.json({
            status: "success",
            message: "Comentario obtenido exitosamente",
            comentario,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "error",
            message: "Error interno del servidor",
        });
    }
};

// ACTUALIZAR UN COMENTARIO
export const actualizarComentario = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;
        const { contenido } = req.body;

        const comentario = await Comentario.findByPk(id, { transaction: t });
        if (!comentario) {
            await t.rollback();
            return res.status(404).json({
                status: "fail",
                message: "El comentario no existe",
            });
        }

        if (contenido) comentario.contenido = contenido;

        await comentario.save({ transaction: t });
        await t.commit();

        res.json({
            status: "success",
            message: "Comentario actualizado exitosamente",
            comentario,
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

// ELIMINAR UN COMENTARIO
export const eliminarComentario = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;

        const comentario = await Comentario.findByPk(id, { transaction: t });
        if (!comentario) {
            await t.rollback();
            return res.status(404).json({
                status: "fail",
                message: "El comentario no existe",
            });
        }

        await comentario.destroy({ transaction: t });
        await t.commit();

        res.json({
            status: "success",
            message: "Comentario eliminado exitosamente",
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
