const { Usuario, Tarea } = require('./models'); // ajusta la ruta si hace falta

async function probar() {
  try {
    const usuarios = await Usuario.findAll();
    console.log('Usuarios:', usuarios);

    const tareas = await Tarea.findAll();
    console.log('Tareas:', tareas);
  } catch (error) {
    console.error('Error al obtener datos:', error);
  }
}

probar();
