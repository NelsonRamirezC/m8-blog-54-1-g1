import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Usuario from "./Usuario.model.js";
import Publicacion from "./Publicacion.model.js";

class Comentario extends Model {}

Comentario.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        usuarioId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Usuario,
                key: "id",
            },
            field: "usuario_id",
            onDelete: "CASCADE",
        },
        publicacionId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Publicacion,
                key: "id",
            },
            field: "publicacion_id",
            onDelete: "CASCADE",
        },
        contenido: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        fechaCreacion: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            field: "fecha_creacion"
        },
    },
    {
        sequelize,
        modelName: "comentario",
        tableName: "comentarios",
        timestamps: true,
        createdAt: "fechaCreacion",
        updatedAt: false, // Se desactiva ya que esta tabla solo registra fecha de creación
        underscored: true
    },
);

// RESTRINGIR QUE EL MODELO MODIFIQUE LA ESTRUCTURA DE LAS TABLAS DE BASE DE DATOS
Comentario.sync({ force: false, alter: false });

export default Comentario;
