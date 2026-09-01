import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Usuario from "./Usuario.model.js";

class Publicacion extends Model {}

Publicacion.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        usuarioId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "usuario_id",
            references: {
                model: Usuario,
                key: "id",
            },
            onDelete: "CASCADE",
        },
        titulo: {
            type: DataTypes.STRING(255),
            allowNull: false,
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
        fechaActualizacion: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            field: "fecha_actualizacion"
        }
    },
    {
        sequelize,
        modelName: "publicacion",
        tableName: "publicaciones",
        timestamps: true,
        createdAt: "fechaCreacion",
        updatedAt: "fechaActualizacion",
        underscored
    },
);

// RESTRINGIR QUE EL MODELO MODIFIQUE LA ESTRUCTURA DE LAS TABLAS DE BASE DE DATOS
Publicacion.sync({ force: false, alter: false });

export default Publicacion;
