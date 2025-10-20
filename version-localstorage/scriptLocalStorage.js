//Intenta leer las tareas guardadas en el navegador (si ya existen de antes). Si no hay nada guardado, usa estos datos por defecto.
const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [
  { id: 1, nombre_usuario: "Isabela", es_admin: false },
  { id: 2, nombre_usuario: "Carlos", es_admin: false },
  { id: 3, nombre_usuario: "Admin", es_admin: true },
];

const tareas = JSON.parse(localStorage.getItem("tareas")) || [
  {
    id: 1,
    titulo: "Estudiar JavaScript",
    estado: "pendiente",
    fecha_creacion: "2025-10-01",
    fecha_vencimiento: "2025-10-10",
    usuario_id: 1,
  },
  {
    id: 2,
    titulo: "Revisar HTML",
    estado: "completada",
    fecha_creacion: "2025-09-25",
    fecha_vencimiento: "2025-09-28",
    usuario_id: 1,
  },
  {
    id: 3,
    titulo: "Preparar entrevista",
    estado: "pendiente",
    fecha_creacion: "2025-10-05",
    fecha_vencimiento: "2025-10-12",
    usuario_id: 2,
  },
  {
    id: 4,
    titulo: "Actualizar CV",
    estado: "pendiente",
    fecha_creacion: "2025-09-20",
    fecha_vencimiento: "2025-09-25",
    usuario_id: 2,
  },
  {
    id: 5,
    titulo: "Organizar tareas",
    estado: "completada",
    fecha_creacion: "2025-10-02",
    fecha_vencimiento: "2025-10-03",
    usuario_id: 3,
  },
];

//Acceder a DOM
const filtroUsuario = document.getElementById("filtroUsuario");
const usuarioAsignado = document.getElementById("usuarioAsignado");
const listaTareas = document.getElementById("listaTareas");
const formNuevaTarea = document.getElementById("formNuevaTarea");
const formNuevoUsuario = document.getElementById("formNuevoUsuario");

//Funciones para guardar y cargar datos desde localStorage
function guardarEnLocalStorage() {
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  localStorage.setItem("tareas", JSON.stringify(tareas));
}

function cargarUsuariosSelect() {
  filtroUsuario.innerHTML = `<option value="todos">Todos</option>`;
  usuarioAsignado.innerHTML = `<option value="">Seleccione un usuario</option>`;

  usuarios.forEach((u) => {
    const option1 = document.createElement("option");
    const option2 = document.createElement("option");
    option1.value = option2.value = u.id;
    option1.textContent = option2.textContent = u.nombre_usuario;
    filtroUsuario.appendChild(option1);
    usuarioAsignado.appendChild(option2);
  });
}

// Muestra tareas
function renderTareas(filtroId = "todos") {
  listaTareas.innerHTML = "";
  const hoy = new Date();

  tareas
    .filter((t) => filtroId === "todos" || t.usuario_id == filtroId)
    .forEach((t) => {
      const usuario =
        usuarios.find((u) => u.id === t.usuario_id)?.nombre_usuario ||
        "Desconocido";
      const vencida =
        new Date(t.fecha_vencimiento) < hoy && t.estado === "pendiente";

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${t.titulo}</td>
        <td>${t.estado}</td>
        <td class="${vencida ? "vencida" : ""}">${
        t.fecha_vencimiento
      }</td>  <!-- Clase en fecha -->
        <td>${usuario}</td>
        <td>
          ${
            t.estado === "pendiente"
              ? `<button onclick="completarTarea(${t.id})">✔ Completar</button>`
              : ""
          }
        </td>
      `;
      listaTareas.appendChild(tr);
    });
}

// Funcion para completar tarea
function completarTarea(id) {
  const tarea = tareas.find((t) => t.id === id);
  if (tarea) tarea.estado = "completada";
  guardarEnLocalStorage();
  renderTareas(filtroUsuario.value);
}

// Crear nueva tarea
formNuevaTarea.addEventListener("submit", (e) => {
  e.preventDefault();
  const titulo = document.getElementById("titulo").value.trim();
  const fechaCreacion = document.getElementById("fechaCreacion").value;
  const fechaVencimiento = document.getElementById("fechaVencimiento").value;
  const usuarioId = parseInt(usuarioAsignado.value);
  const estado = document.getElementById("estadoPendiente").checked
    ? "pendiente"
    : "completada";

  if (fechaVencimiento < fechaCreacion) {
    alert(
      "⚠️ La fecha de vencimiento no puede ser anterior a la fecha de creación."
    );
    return;
  }

  const nuevaTarea = {
    id: Date.now(),
    titulo,
    estado,
    fecha_creacion: fechaCreacion,
    fecha_vencimiento: fechaVencimiento,
    usuario_id: usuarioId,
  };

  tareas.push(nuevaTarea);
  guardarEnLocalStorage();
  formNuevaTarea.reset();
  renderTareas(filtroUsuario.value);
});

// Crear nuevo usuario
formNuevoUsuario.addEventListener("submit", (e) => {
  e.preventDefault();
  const nombre = document.getElementById("nombreUsuario").value.trim();
  const esAdmin = document.getElementById("esAdminUsuario").checked;

  const nuevoUsuario = {
    id: Date.now(),
    nombre_usuario: nombre,
    es_admin: esAdmin,
  };
  usuarios.push(nuevoUsuario);
  guardarEnLocalStorage();
  cargarUsuariosSelect();
  formNuevoUsuario.reset();
});

// Filtrar tareas por usuario
filtroUsuario.addEventListener("change", (e) => renderTareas(e.target.value));

// Iniciar app
cargarUsuariosSelect();
renderTareas("todos");
