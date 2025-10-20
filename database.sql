--CREACION DE TABLAS--

-- Tabla de usuarios
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre_usuario VARCHAR(50) NOT NULL,
    es_admin BOOLEAN DEFAULT FALSE
);
-- Tabla de tareas
CREATE TABLE tareas (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    estado VARCHAR(20) CHECK (estado IN ('pendiente', 'completada')) NOT NULL,
    fecha_creacion DATE NOT NULL,
    fecha_vencimiento DATE NOT NULL,
    usuario_id INT REFERENCES usuarios(id)
);

-- Insertar usuarios
INSERT INTO usuarios (nombre_usuario, es_admin) VALUES
('juan', false),
('maria', false),
('admin', true);

-- Insertar tareas
INSERT INTO tareas (titulo, estado, fecha_creacion, fecha_vencimiento, usuario_id) VALUES
('Tarea 1', 'pendiente', '2025-10-01', '2025-10-10', 1),
('Tarea 2', 'completada', '2025-09-25', '2025-10-05', 2),
('Tarea 3', 'pendiente', '2025-09-28', '2025-10-01', 3), -- vencida
('Tarea 4', 'pendiente', '2025-10-02', '2025-10-20', 1),
('Tarea 5', 'completada', '2025-09-20', '2025-09-30', 2); -- vencida pero completada



--  CONSULTAS SQL --


-- 1. Tareas ordenadas por fecha de vencimiento:
SELECT * FROM tareas ORDER BY fecha_vencimiento;
-- 2. Cuántas tareas están pendientes y cuántas completadas:
SELECT estado, COUNT(*) FROM tareas GROUP BY estado;
-- 3. Tareas vencidas y pendientes
SELECT * FROM tareas WHERE estado = 'pendiente' and fecha_vencimiento < CURRENT_DATE;
-- 4. Mostrar las tareas asignadas a un usuario específico:
SELECT * FROM tareas WHERE usuario_id = 1;
-- 5. Mostrar todas las tareas (solo accesible para el administrador).
SELECT * FROM tareas; -- Esto se filtra con JavaScript, ya que SQL no sabe quién es el usuario actual.
