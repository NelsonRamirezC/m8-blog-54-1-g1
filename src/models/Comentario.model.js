import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Usuario from "./Usuario.model.js";
import Publicacion from "./publicacion.model.js";

class Comentario extends Model {}

Comentario.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        usuario_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Usuario,
                key: "id",
            },
            onDelete: "CASCADE",
        },
        publicacion_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Publicacion,
                key: "id",
            },
            onDelete: "CASCADE",
        },
        contenido: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "comentario",
        tableName: "comentarios",
        timestamps: true,
        createdAt: "fecha_creacion",
        updatedAt: false, // Se desactiva ya que esta tabla solo registra fecha de creación
    },
);

// RESTRINGIR QUE EL MODELO MODIFIQUE LA ESTRUCTURA DE LAS TABLAS DE BASE DE DATOS
Comentario.sync({ force: false, alter: false });

export default Comentario;
