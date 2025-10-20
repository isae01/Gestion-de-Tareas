// Variables globales para almacenar los datos traídos del backend
let usuarios = [];
let tareas = [];

// Usuario actual sera admin para mostrar todas las tareas y usuarios
const usuarioActual = { id: 3, esAdmin: true, nombre_usuario: "admin" };

// Función para traer usuarios del backend usando fetch
async function fetchUsuarios() {
  try {
    const res = await fetch("http://localhost:3000/usuarios");
    usuarios = await res.json();
  } catch (error) {
    console.error("Error cargando usuarios:", error);
  }
}

// Función para traer tareas del backend usando fetch
async function fetchTareas() {
  try {
    const res = await fetch("http://localhost:3000/tareas");
    tareas = await res.json();
  } catch (error) {
    console.error("Error cargando tareas:", error);
  }
}

// Función para llenar el select filtroUsuario con usuarios reales
function mostrarUsuarios() {
  const select = document.getElementById("filtroUsuario");
  select.innerHTML = '<option value="0">Todos</option>';

  usuarios.forEach((usuario) => {
    const option = document.createElement("option");
    option.value = usuario.id;
    option.textContent = usuario.nombre_usuario || usuario.nombre;
    select.appendChild(option);
  });

  // Al cambiar el filtro, se recargan las tareas según selección
  select.addEventListener("change", mostrarTareas);
}

// Función para llenar el select del formulario con usuarios reales
function mostrarUsuariosEnFormulario() {
  const select = document.getElementById("usuarioAsignado");
  select.innerHTML = "";

  usuarios.forEach((usuario) => {
    const option = document.createElement("option");
    option.value = usuario.id;
    option.textContent = usuario.nombre_usuario || usuario.nombre;
    select.appendChild(option);
  });
}

// Función para mostrar las tareas en la tabla según filtro y usuario actual
function mostrarTareas() {
  const tbody = document.getElementById("listaTareas");
  const filtroUsuarioId = parseInt(
    document.getElementById("filtroUsuario").value
  );
  tbody.innerHTML = "";

  // Filtrar tareas
  const tareasFiltradas = tareas
    .filter((t) => usuarioActual.esAdmin || t.usuarioId === usuarioActual.id)
    .filter((t) => filtroUsuarioId === 0 || t.usuarioId === filtroUsuarioId);

  tareasFiltradas.forEach((tarea) => {
    const tr = document.createElement("tr");

    const esVencida =
      new Date(tarea.fecha_vencimiento) < new Date() &&
      tarea.estado === "pendiente";

    // Buscamos el nombre del usuario asignado a la tarea
    const usuarioAsignado = usuarios.find((u) => u.id === tarea.usuarioId);

    // Agregamos la fila con datos
    tr.innerHTML = `
      <td>${tarea.titulo}</td>
      <td class="${tarea.estado === "completada" ? "tarea-completada" : ""}">${
      tarea.estado
    }</td>
      <td class="${esVencida ? "tarea-vencida" : ""}">${
      tarea.fecha_vencimiento
    }</td>
      <td>${
        usuarioAsignado
          ? usuarioAsignado.nombre_usuario || usuarioAsignado.nombre
          : "Desconocido"
      }</td>
      <td>
        ${
          tarea.estado === "pendiente"
            ? `<button onclick="completarTarea(${tarea.id})">Completar</button>`
            : ""
        }
      </td>
    `;

    tbody.appendChild(tr);
  });
}

// Función para marcar una tarea como completada y actualizar backend
async function completarTarea(id) {
  const tarea = tareas.find((t) => t.id === id);
  if (!tarea) return;

  try {
    // Enviamos un PUT al backend para actualizar el estado
    const res = await fetch(`http://localhost:3000/tareas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...tarea, estado: "completada" }),
    });
    if (!res.ok) throw new Error("Error actualizando tarea");

    tarea.estado = "completada"; // Actualizamos localmente también
    mostrarTareas(); // Mostramos cambio
  } catch (error) {
    alert("Error al completar la tarea");
    console.error(error);
  }
}

// Listener para el formulario de nueva tarea
document
  .getElementById("formNuevaTarea")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    // Tomamos los valores del formulario
    const titulo = document.getElementById("titulo").value;
    const fecha_creacion = document.getElementById("fechaCreacion").value;
    const fecha_vencimiento = document.getElementById("fechaVencimiento").value;
    const usuarioId = parseInt(
      document.getElementById("usuarioAsignado").value
    );
    const estado = document.getElementById("estadoPendiente").checked
      ? "pendiente"
      : "completada";

    // Validación: fecha vencimiento >= fecha creación
    if (new Date(fecha_vencimiento) < new Date(fecha_creacion)) {
      alert(
        "La fecha de vencimiento no puede ser anterior a la fecha de creación."
      );
      return;
    }

    // Creamos el objeto para enviar
    const nuevaTarea = {
      titulo,
      estado,
      fecha_creacion,
      fecha_vencimiento,
      usuarioId,
    };

    try {
      // Enviamos POST para crear tarea en backend
      const res = await fetch("http://localhost:3000/tareas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevaTarea),
      });
      if (!res.ok) throw new Error("Error creando tarea");

      const tareaCreada = await res.json();
      tareas.push(tareaCreada); // Añadimos tarea a array local
      mostrarTareas(); // Mostramos tareas
      this.reset(); // Limpiamos formulario
      alert("Tarea creada con éxito");
    } catch (error) {
      alert("Error al crear tarea");
      console.error(error);
    }
  });

document
  .getElementById("formNuevoUsuario")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const nombre_usuario = document
      .getElementById("nombreUsuario")
      .value.trim();
    const es_admin = document.getElementById("esAdminUsuario").checked;

    if (!nombre_usuario) {
      alert("Por favor, ingresa un nombre de usuario.");
      return;
    }

    const nuevoUsuario = { nombre_usuario, es_admin };

    try {
      const res = await fetch("http://localhost:3000/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoUsuario),
      });

      if (!res.ok) {
        let errorMsg = "Error creando usuario";
        try {
          const errorData = await res.json();
          if (errorData.message) errorMsg = errorData.message;
        } catch {}
        throw new Error(errorMsg);
      }

      const usuarioCreado = await res.json();
      usuarios.push(usuarioCreado); // Actualizar array local
      mostrarUsuarios(); // Actualizar select filtro usuarios
      mostrarUsuariosEnFormulario(); // Actualizar select del formulario de tareas
      this.reset(); // Limpiar formulario
      alert("Usuario creado con éxito");
    } catch (error) {
      alert("Error al crear usuario: " + error.message);
      console.error("Error creando usuario:", error);
    }
  });

// Función iniciar la aplicación: trae datos y muestra todo
async function inicializar() {
  await fetchUsuarios();
  await fetchTareas();
  mostrarUsuarios();
  mostrarUsuariosEnFormulario();
  mostrarTareas();
}

// Llamamos la función de inicio
inicializar();
