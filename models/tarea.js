"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Tarea extends Model {
    static associate(models) {
      // Aquí definimos la relación con Usuario
      Tarea.belongsTo(models.Usuario, {
        foreignKey: "usuarioId",
        as: "Usuario",
      });
    }
  }

  Tarea.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      titulo: DataTypes.STRING,
      estado: DataTypes.STRING,
      fecha_creacion: DataTypes.DATE,
      fecha_vencimiento: DataTypes.DATE,
      usuarioId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Tarea",
      tableName: "tareas", // nombre exacto de la tabla en la base de datos
      timestamps: false,
    }
  );

  return Tarea;
};

// npx sequelize-cli model:generate --name Tarea --attributes titulo:string,estado:string,fecha_creacion:date,fecha_vencimiento:date,usuarioId:integer
// Este comando genera automáticamente:
// 1. El modelo Tarea en /models (estructura de la tabla en JS)
// 2. La migración en /migrations (código para crear la tabla en la base de datos)
// No crea la tabla aún, solo los archivos necesarios.
// Luego debo correr: npx sequelize-cli db:migrate para que se cree la tabla en PostgreSQL.
