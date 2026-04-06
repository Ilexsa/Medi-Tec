# AI Agent Context: TecnoMed API Documentation

Este documento está diseñado para proveer a un agente de IA todo el contexto técnico de la API de TecnoMed, incluyendo rutas exactas, tipado de datos y middlewares requeridos, previniendo alucinaciones al generar el frontend (React/TS).

## 1. Configuración Global
- **Base URL**: `/api-tecno-med/api/v1`
- **Autenticación Base**: Requiere Header `Authorization: Bearer <TOKEN>` para rutas protegidas.
- **Multitenant Context**: Las rutas protegidas obtienen el `inquilino_id` del token JWT automáticamente y validan el estado de la **Suscripción**.
- **Roles principales**: `super_admin`, `admin`, `medico`, `recepcionista`.

---

## 2. Modelos de Datos Principal (Data Dictionary)

Esta sección lista la firma JSON en las solicitudes/respuestas. Todo campo *puntero* (`*string`, `*int64`, etc.) en Go es **opcional** en el JSON.

### 2.1 Usuarios y Autenticación
* **Usuario (Respuesta General)**: `id` (int), `email` (string), `nombres` (string), `apellidos` (string), `rol` (string), `especialidad_id` (int?), `estado` (string).
* **Login Req**: `{ "email": string(req), "password": string(req) }`
* **Register Req**: `{ "nombre": string(req), "email": string(req), "password": string(req), "telefono": string(?) }`
* **CrearUsuario Req (Rol Admin)**: `nombre`, `email`, `password`, `rol`, `inquilino_id`.

### 2.2 Inquilinos & Suscripciones
* **Inquilino**: `id` (int), `nombre` (str), `subdominio` (str), `email` (str?), `telefono` (str?), `direccion` (str?), `tipo_plan` (str), `estado` (str).
* **CrearInquilinoReq**: `{ "nombre"(req), "ruc"(req), "email_contacto"(req), "telefono"(?), "direccion"(?), "pais"(req), "admin_nombre"(?), "admin_email"(?) }`
* **PlanSuscripcion**: `id`, `nombre`, `precio` (float), `duracion_dias` (int), `max_medicos` (int).
* **Suscripcion**: `plan_id` (int), `medico_id` (int?), `fecha_inicio` (str), `fecha_fin` (str).

### 2.3 Médicos y Horarios
* **Medico (Base)**: `id`, `usuario_id`, `especialidad_id`, `nombres`, `apellidos`, `identificacion`, `email`, `telefono`, `acepta_nuevos_pacientes` (bool), `activo` (bool).
* **CrearMedicoReq**: `{ "nombres"(req), "apellidos"(req), "especialidad_id"(?), "numero_licencia"(?), "crear_usuario" (bool), "usuario_email"(?), "usuario_password"(?) }`
* **MedicoHorario**: `{ "dia_semana": int(0-6), "hora_inicio": string("HH:MM:SS"), "hora_fin": string("HH:MM:SS"), "duracion_slot": int(min:5), "intervalo_descanso": int(?) }`
* **MedicoBloqueoReq**: `{ "medico_id": int(req), "fecha_inicio": str("YYYY-MM-DD"), "fecha_fin": str("YYYY-MM-DD"), "hora_inicio": str("HH:MM"), "tipo_bloqueo": str(req, vacation|sick_leave|meeting|other), "todo_el_dia": bool }`

### 2.4 Pacientes
* **Paciente**: `id` (int), `identificacion` (str), `tipo_identificacion` (str: cedula|passport|ruc|other), `nombres` (str), `apellidos` (str), `fecha_nacimiento` (str ISO/Date), `genero` (str: male|female|other), `telefono` (str?), `email` (str?), `tipo_sangre` (str?), `alergias` (str?), `estado` (str).
* **Crear/Actualizar Paciente**: Los campos requeridos obligatorios (`binding:"required"`) son `identificacion`, `tipo_identificacion`, `nombres`, `apellidos`, `fecha_nacimiento` y `genero`.

### 2.5 Especialidades
* **Especialidad**: `id` (int), `nombre` (req), `descripcion` (str?), `duracion_por_defecto` (int?), `color`, `icono`.

### 2.6 Citas
* **Cita**: `id` (int), `turno_id` (int?), `paciente_id` (int), `medico_id` (int), `especialidad_id` (int), `fecha_cita` (datetime), `hora_inicio` ("HH:MM:SS"), `hora_fin` ("HH:MM:SS"), `duracion_minutos` (int), `estado` (str), `motivo` (str?).
* Los estados comunes de la cita evolucionan y se cambian con `CheckIn` y `Cancelar`.

### 2.7 Turnos
* **Crear (Generar) Masivo**: `{ "medico_id": int(req), "fecha_inicio": str(req), "fecha_fin": str(req), "duracion_slot": int(req) }`
* **Reservar Turno Req**: `{ "turno_id": int(req), "paciente_id": int(?), "tipo_cita": str(?) }`
* **TurnoDisponibleResponse**: `turno_id`, `medico_id`, `medico_nombre`, `especialidad`, `fecha`, `hora_inicio`, `hora_fin`, `duracion_minutos`, `disponible` (bool).

### 2.8 Consultas
* **CrearConsultaRequest**: `{ "cita_id": int(?), "paciente_id": int(req), "motivo_consulta": str(req), "enfermedad_actual": str(?), "peso", "talla", "temperatura", "presion_sistolica", "presion_diastolica", "frecuencia_cardiaca", "frecuencia_respiratoria", "saturacion_oxigeno" }`
* **ActualizarConsultaRequest**: Permite actualizar el examen físico, revisión de sistemas, signos vitales, plan de tratamiento, evolución y notas.
* **ConsultaCompletaResponse**: Contiene la `Consulta`, el listado de `Diagnosticos` y el resumen de `Paciente` y `Medico`.
* **AgregarDiagnosticoReq**: `{ "cie10_id": int(req), "tipo_diagnostico": str(principal|secondary|differential), "notas": str(?) }`

### 2.9 Órdenes Médicas
* **OrdenMedica**: `consulta_id` (int?), `paciente_id` (int), `medico_id` (int), `diagnostico_presuntivo` (str?).
* **CrearOrdenItemReq**: `{ "examen_id": int(?), "nombre_examen": str, "observaciones": str(?) }` 
*(nota: si `examen_id` es nulo, `nombre_examen` funciona como texto libre).*
* **ActualizarResultadoItemReq**: `{ "resultado": str(req), "fecha_resultado": str(?) }`

### 2.10 Recetas
* **Receta Base Req**: `{ "consulta_id": int, "paciente_id": int, "medico_id": int, "indicaciones_generales": str }`
* **Agregar Ítem a Receta**: Requiere en la tabla `recetas_items`: `medicamento_id` (int?), `dosis` (str), `frecuencia` (str), `duracion` (str).

### 2.11 Facturación y Caja
* **Factura**: `paciente_id`, `subtotal` (float), `descuento` (float), `impuestos` (float), `total` (float). 
* Consta de detalles con `item_facturable_id`, `cantidad`, `precio_unitario`.
* **CierreCaja**: Cierre con montos reportados y por sistema, `estado` (abierto|cerrado).

### 2.12 Catálogos (Medicamentos, CIE10, Ítems Facturables, Exámenes)
* **CatalogoCIE10**: `id`, `codigo`, `descripcion`.
* **CatalogoItemFacturable**: `codigo`, `nombre`, `precio_base` (float).
* **CatalogoMedicamento**: `nombre_generico`, `presentacion`.
* **CatalogoExamen**: `codigo`, `nombre`, `precio_referencial`.

---

## 3. Listado Completo de Rutas (Endpoints)

Base Url Obligatoria: `/api-tecno-med/api/v1`

| Contexto | Método | Ruta Parametrizada |
|----------|--------|------------------|
| **Auth** | POST | `/auth/login` |
| **Auth** | POST | `/auth/register` |
| **Auth** | GET | `/auth/me` |
| **Auth** | POST | `/auth/logout` |
| **Usuarios** | GET | `/usuarios` |
| **Usuarios** | POST | `/usuarios` |
| **Usuarios** | GET, PUT, DELETE | `/usuarios/:id` |
| **Usuarios** | PUT | `/usuarios/:id/cambiar-password` |
| **Especialidades** | GET | `/especialidades` |
| **Especialidades** | POST | `/especialidades` |
| **Especialidades** | GET, PUT, DELETE | `/especialidades/:id` |
| **Pacientes** | GET | `/pacientes` |
| **Pacientes** | GET | `/pacientes/buscar?q=...` |
| **Pacientes** | GET | `/pacientes/:id` |
| **Pacientes** | POST | `/pacientes` |
| **Pacientes** | PUT, DELETE | `/pacientes/:id` |
| **Pacientes** | GET | `/pacientes/:id/recetas` |
| **Pacientes** | GET | `/pacientes/:id/facturacion/resumen` |
| **Inquilinos** | GET | `/inquilinos` |
| **Inquilinos** | POST | `/inquilinos` |
| **Inquilinos** | GET | `/inquilinos/actual` |
| **Inquilinos** | PUT | `/inquilinos/actual` |
| **Inquilinos** | GET | `/inquilinos/:id` |
| **Inquilinos** | PUT | `/inquilinos/:id/estado` |
| **Inquilinos (Plan)**| GET, POST | `/inquilinos/:id/suscripciones` |
| **Citas** | GET, POST | `/citas` |
| **Citas** | GET | `/citas/disponibilidad` *(Query Params: medico_id, fecha)* |
| **Citas** | GET, PUT | `/citas/:id` |
| **Citas** | PUT | `/citas/:id/check-in` |
| **Citas** | PUT | `/citas/:id/cancelar` |
| **Consultas** | POST | `/consultas/iniciar` |
| **Consultas** | GET, PUT | `/consultas/:id` |
| **Consultas** | POST | `/consultas/:id/finalizar` |
| **Consultas Diag** | GET, POST, PUT | `/consultas/:id/diagnosticos` *(El PUT es reemplazo total de diagnósticos)* |
| **Consultas Receta**| GET | `/consultas/:id/recetas` |
| **Turnos (Gen)** | GET | `/turnos/disponibles` *(Query Params: fecha, medico_id)* |
| **Turnos (Gen)** | GET | `/turnos/resumen` |
| **Turnos (Gen)** | POST | `/turnos/generar` |
| **Turnos (Gen)** | POST | `/turnos/reservar` |
| **Turnos (Gen)** | PUT | `/turnos/:id/liberar` |
| **Turnos Médicos** | GET | `/turnos/medico/:medico_id/dia` *(Query Params: fecha)* |
| **Turnos Médicos** | GET | `/turnos/medico/:medico_id/rango` *(Query Params: desde, hasta)* |
| **Médicos** | GET | `/medicos` |
| **Médicos** | POST | `/medicos` |
| **Médicos** | GET, PUT, DELETE | `/medicos/:medico_id` |
| **Méd. Horarios** | GET, POST | `/medicos/:medico_id/horarios` |
| **Méd. Horarios** | PUT, DELETE | `/medicos/:medico_id/horarios/:horario_id` |
| **Méd. Bloqueos** | GET, POST | `/medicos/:medico_id/bloqueos` |
| **Méd. Bloqueos** | DELETE | `/medicos/:medico_id/bloqueos/:bloqueo_id` |
| **Méd. Tarifas** | GET, POST | `/medicos/:medico_id/tarifas` |
| **Tarifas** | PUT, DELETE | `/tarifas/:tarifa_id` |
| **Cat. Medicam.** | GET, POST | `/catalogo-medicamentos` |
| **Cat. Medicam.** | GET | `/catalogo-medicamentos/buscar` |
| **Cat. Medicam.** | GET, PUT, DELETE | `/catalogo-medicamentos/:id` |
| **Cat. Items** | GET, POST | `/catalogo-items` |
| **Cat. Items** | GET | `/catalogo-items/buscar` |
| **Cat. Items** | GET, PUT, DELETE | `/catalogo-items/:id` |
| **Cat. Exámenes** | GET, POST | `/catalogo-examenes` |
| **Cat. Exámenes** | GET, PUT, DELETE | `/catalogo-examenes/:id` |
| **Recetas** | POST | `/recetas` |
| **Recetas** | GET | `/recetas/:id` |
| **Recetas** | PUT | `/recetas/:id/estado` |
| **Recetas Items** | POST | `/recetas/:id/items` |
| **Recetas Items** | DELETE | `/recetas/:id/items/:item_id` |
| **Órdenes Méd.** | GET, POST | `/ordenes-medicas` |
| **Órdenes Méd.** | GET | `/ordenes-medicas/:id` |
| **Órdenes Méd.** | PUT | `/ordenes-medicas/:id/anular` |
| **Órdenes Méd.** | PUT | `/ordenes-medicas/:id/procesar` |
| **Orden. Items** | POST | `/ordenes-medicas/:id/items` |
| **Orden. Items** | PUT | `/ordenes-medicas/:id/items/:item_id/resultado` |
| **Orden. Items** | DELETE | `/ordenes-medicas/:id/items/:item_id` |
| **Facturas** | GET, POST | `/facturas` |
| **Facturas** | GET | `/facturas/:id` |
| **Facturas** | PUT | `/facturas/:id/anular` |
| **Facturas Pagos** | GET, POST | `/facturas/:id/pagos` |
| **Caja** | GET | `/caja` |
| **Caja** | GET | `/caja/actual` |
| **Caja** | POST | `/caja/abrir` y `/caja/cerrar` |
| **Caja** | GET | `/caja/:id` y `/caja/:id/resumen` |
| **Suscripciones** | GET, POST | `/suscripciones` |
| **Suscripciones** | GET | `/suscripciones/:id` |
| **Suscripciones** | PUT | `/suscripciones/:id/estado` |

## 4. Notas de Implementación Frontend IA
1. Validar Types: Al construir los interfaces en Typescript / React usar en la medida de los opcionales `?` en las peticiones en los campos que están marcados con [(?)](file:///c:/Proyectos%20TecnoAndes/HIS%20TecnoAndes/Api/internal/routes/routes.go#13-308) (los pointer `*` en GO).
2. Manejo de Errores: La API devuelve JSON estructurado con status en caso de errores en Binding. (Típicamente en rutas de Iniciar Consulta o Reservar Turnos). En casos exitosos 200/201.
3. Pagination params: usar `page=1&limit=X`. Las query vars como `q`, `search` o `fecha` se aplican en los listados generales (Ej: `/pacientes/buscar`).
4. Al consumir rutas, nunca olvidar parsear fecha tipo `YYYY-MM-DD` donde sea requerido, distinto del tipo DateTime completo al consultar `created_at`.
