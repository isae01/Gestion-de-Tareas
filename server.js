/* 
Explicacion breve: Es un servidor backend hecho con Node.js y Express que se conecta a tu base de datos a través de Sequelize (con los modelos Usuario y Tarea). Ofrece APIs REST para obtener tareas, usuarios y crear nuevas tareas. Y permite que el frontend pueda pedir datos y enviar datos a la base.
*/

const express = require("express");
const path = require("path");
const cors = require("cors");
const { Usuario, Tarea } = require("./models");

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.resolve(__dirname)));

// Ruta raíz
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "index.html"));
});

// Rutas API, Obtener todos los usuarios
app.get("/usuarios", async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

// Crear un nuevo usuario
app.post("/usuarios", async (req, res) => {
  try {
    const { nombre_usuario, es_admin } = req.body;
    if (!nombre_usuario)
      return res.status(400).json({ message: "nombre_usuario es obligatorio" });

    const usuario = await Usuario.create({
      nombre_usuario,
      es_admin: !!es_admin,
    });
    res.status(201).json(usuario);
  } catch (error) {
    console.error("Error creando usuario:", error);
    res.status(500).json({ error: "Error creando usuario" });
  }
});

// Obtener todas las tareas
app.get("/tareas", async (req, res) => {
  try {
    const tareas = await Tarea.findAll({
      include: { model: Usuario, as: "Usuario" },
    });
    res.json(tareas);
  } catch (error) {
    console.error("Error al obtener tareas:", error);
    res.status(500).json({ error: "Error al obtener tareas" });
  }
});

// Crear nueva tarea
app.post("/tareas", async (req, res) => {
  try {
    const { titulo, estado, fecha_creacion, fecha_vencimiento, usuarioId } =
      req.body;

    if (new Date(fecha_vencimiento) < new Date(fecha_creacion)) {
      return res.status(400).json({
        error:
          "La fecha de vencimiento no puede ser anterior a la fecha de creación.",
      });
    }

    const tarea = await Tarea.create({
      titulo,
      estado,
      fecha_creacion,
      fecha_vencimiento,
      usuarioId,
    });
    res.status(201).json(tarea);
  } catch (error) {
    console.error("Error al crear tarea:", error);
    res.status(500).json({ error: "Error al crear tarea" });
  }
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// Ahora se puede iniciar el servidor con `node server.js` y se conecta a la base de datos con las APIs.
