# Informe de pruebas

Fecha: 2026-10-09. La prueba API se ejecutó con el servidor `npm start` en `NODE_ENV=production`, un código local de prueba y sin conectarse a Supabase o Gemini reales.

| # | Prueba solicitada | Resultado | Evidencia / límite |
|---|---|---|---|
| 1 | Primera entrada del alumno | Parcial | Formulario con nombre, apellido y curso implementado. No ejecutado en navegador real. |
| 2 | Captura de identidad | Parcial | Inserción de perfil Supabase implementada con RLS de solo inserción para `anon`; no probada contra un proyecto real. |
| 3 | Acceso al contenido inicial | Parcial | No hay bloqueo inicial salvo el formulario de identidad. No ejecutado visualmente en navegador. |
| 4 | Expediente 2 bloqueado inicialmente | Aprobado en API | `GET /api/expediente2` sin permiso devuelve HTTP 401. El contenido no aparece en el bundle público. |
| 5 | Código incorrecto | Aprobado en API | Código incorrecto devuelve HTTP 401 y no genera permiso. |
| 6 | Código correcto | Aprobado en API con modo local | Código configurado en variable local genera permiso firmado; la consulta protegida devuelve las seis secciones. Flujo persistido en Supabase pendiente. |
| 7 | Envío de actividad | Parcial | Nivel, situaciones y detective conectados a inserciones centrales; no probado con credenciales de base. |
| 8 | Respuesta central asociada | Pendiente de integración real | Tabla, FK, timestamp y RLS implementados; no se hizo inserción en Supabase. |
| 9 | Segundo alumno / navegador | Pendiente de integración real | IDs de perfil distintos y asociación por FK implementados; hace falta Supabase para comprobar persistencia entre dispositivos. |
| 10 | Respuestas no mezcladas | Pendiente de integración real | Consultas del panel filtran por `student_id`; requiere probarse con registros reales. |
| 11 | Ingreso docente desde otro dispositivo | Pendiente de integración real | Supabase Auth y validación `app_metadata.role=docente` implementados; cuenta no creada. |
| 12 | Ver alumnos y respuestas | Pendiente de integración real | Panel implementado; requiere proyecto Auth/DB con datos. |
| 13 | Seleccionar alumno y consultar actividades | Pendiente de integración real | Búsqueda, filtro de curso, actividad y alumno implementados; no probado con datos reales. |
| 14 | Anonimato del buzón | Parcial | `anonymous_questions` no tiene `student_id` ni relación a `students`; inserción anónima conectada. No probado bajo sesión real de Supabase. |
| 15 | Gemini con clave | No probado | `GEMINI_API_KEY` sigue solo en Express; no se proporcionó una clave. Se probó la respuesta local de respaldo bloqueada y desbloqueada. |
| 16 | Compilación y modo producción | Aprobado | `npm run lint`, `npm run build`, `npm start` y smoke test de API pasan. |

## Comandos verificados

- `npm run lint` → correcto.
- `npm run build` → correcto.
- `API_BASE_URL=http://127.0.0.1:3456 TEST_EXPEDIENTE2_CODE=SampleTestCode npm run test:api` → correcto.
- Inspección de `dist/assets/*.js` → no aparecen el contenido del Expediente 2, claves de entorno ni credenciales de prueba.

Las pruebas 1–3 y 7–15 requieren interfaz en navegador y/o recursos externos reales. No deben considerarse aprobadas hasta repetirlas después de configurar Supabase y Render.
