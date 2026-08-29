import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import { generarHash } from "../utils/hash.js";

class Usuario extends Model {}

Usuario.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
            set(value) {
                this.setDataValue("password", generarHash(value));
            },
        },
        fecha_creacion: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        admin: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    },
    {
        sequelize,
        modelName: "usuario",
        tableName: "usuarios",
        timestamps: false, // Desactiva createdAt y updatedAt automáticos para coincidir con tu tabla
    },
);
//RESTRINGIR QUE EL MODELO MODIFIQUE LA ESTRUCTURA DE LAS TABLAS DE BASE DE DATOS
Usuario.sync({ force: false, alter: false });

export default Usuario;
