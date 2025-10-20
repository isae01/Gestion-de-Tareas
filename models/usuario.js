// models/usuario.js
"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    static associate(models) {
      // Un usuario tiene muchas tareas
      Usuario.hasMany(models.Tarea, { foreignKey: "usuarioId", as: "Tareas" });
    }
  }

  Usuario.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nombre_usuario: DataTypes.STRING,
      es_admin: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Usuario",
      tableName: "usuarios",
      timestamps: false,
    }
  );

  return Usuario;
};
