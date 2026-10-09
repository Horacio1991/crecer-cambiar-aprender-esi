# Crecer, Cambiar y Aprender — ESI 6.º grado

Aplicación web escolar basada en el proyecto original. Conserva sus contenidos y actividades, suma identificación simple del alumno, envíos centrales, panel docente autenticado y acceso por código al Expediente 2.

## Arquitectura

- **React + Vite** entrega la interfaz. El alumno se identifica con nombre, apellido y curso; no hay cuentas de alumnos. El navegador recuerda la ficha localmente y ofrece **Cambiar alumno**.
- **Supabase Auth + Postgres con RLS** guarda alumnos, respuestas y buzón anónimo. Los navegadores de alumnos solo pueden insertar. No pueden consultar o cambiar registros. El rol docente (`app_metadata.role=docente`) puede leer los registros, marcar respuestas revisadas y eliminarlas.
- **Express en Render** mantiene `GEMINI_API_KEY` y la clave de servicio de Supabase exclusivamente en servidor. La docente genera/rota/desactiva el código desde el panel privado; la base guarda solo su hash. Tras validarlo, el servidor firma un permiso de ocho horas y entrega el contenido protegido. Hay límite temporal de intentos.
- **Buzón de Preguntas** conserva su anonimato: la fila de pregunta no guarda ni referencia el alumno. La respuesta pedagógica local/Gemini existente se mantiene.

La identificación sin cuentas permite que un alumno use cualquier dispositivo, pero no autentica que el nombre introducido corresponda a la persona real. Ese es el límite deliberado de no usar cuentas para menores.

## Requisitos y ejecución local

Node.js 22 o 24 y npm.

1. Copiar `.env.example` a `.env`; agregar también `SUPABASE_URL` (puede ser igual a `VITE_SUPABASE_URL`) y la clave privada `SUPABASE_SERVICE_ROLE_KEY` para que el panel cree/desactive códigos.
2. Crear el proyecto Supabase y ejecutar el SQL de `supabase/migrations/202610090001_initial_schema.sql` en **SQL Editor**.
3. Completar `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en `.env`. Son valores públicos del proyecto y la seguridad depende de RLS.
4. Asignar un secreto aleatorio a `EXPEDIENTE2_TOKEN_SECRET` (por ejemplo `openssl rand -base64 48`).
5. Opcionalmente configurar `GEMINI_API_KEY`. Para probar desbloqueo sin conectar Supabase, configurar temporalmente `EXPEDIENTE2_CODE` en `.env` (solo uso local).
6. Ejecutar `npm install`, luego `npm run dev`. Abrir `http://localhost:3000`.

`npm run lint` ejecuta TypeScript y `npm run build` genera `dist/`. `npm start` ejecuta Express, que sirve tanto la API como el frontend compilado. `tsx` se instala también como dependencia de ejecución para que Render pueda arrancar el servicio en modo producción.

## Configuración exacta de Supabase

1. Crear un proyecto en [Supabase](https://supabase.com/).
2. En **Project Settings → API**, copiar Project URL y la clave `anon`/publishable. Ponerlos en `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
3. Abrir **SQL Editor → New query**, pegar y ejecutar el contenido de `supabase/migrations/202610090001_initial_schema.sql`.
4. En **Authentication → Providers → Email**, mantener Email habilitado. En **Authentication → Settings**, desactivar los registros públicos/signups. Los alumnos no usan Auth.
5. En **Authentication → Users**, crear la cuenta para la docente con su correo y una contraseña robusta.
6. En SQL Editor asignarle rol docente (reemplazar el correo):

   ```sql
   update auth.users
   set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"docente"}'::jsonb
   where email = 'docente@escuela.edu.ar';
   ```

7. En **Project Settings → API**, copiar la clave `service_role` únicamente a `SUPABASE_SERVICE_ROLE_KEY` en el entorno privado de Render/local. No pegarla en el cliente ni en GitHub.
8. Cerrar e iniciar sesión nuevamente si la docente ya tenía una sesión abierta. La pantalla y la API validan el rol; RLS vuelve a verificarlo en la base.

La clave `service_role` es obligatoria solo en el entorno privado del servidor. El repositorio no contiene la clave; nunca la publiques ni la asignes a una variable `VITE_*`.

La tabla `app_settings` no tiene políticas para los roles `anon` ni `authenticated`; solo el backend, mediante su service key privada, puede guardar o validar el hash del código.

## GitHub

Desde la carpeta del proyecto:

```bash
git init
git add .
git commit -m "Preparar aplicación ESI para producción"
git branch -M main
git remote add origin https://github.com/USUARIO/crecer-cambiar-aprender-esi.git
git push -u origin main
```

Crear previamente un repositorio vacío en GitHub y reemplazar `USUARIO` por el usuario u organización. `.env`, `node_modules` y `dist` están excluidos de Git.

## Render

1. Crear un **Web Service** desde el repositorio GitHub.
2. Runtime: **Node**; Build command: `npm install && npm run build`; Start command: `npm start`.
3. Configurar variables de entorno en **Environment**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (solo entorno del servidor; jamás `VITE_*`)
   - `EXPEDIENTE2_TOKEN_SECRET`
   - opcional `GEMINI_API_KEY`
4. Guardar y desplegar. Render define `PORT` automáticamente.
5. Abrir la URL `onrender.com` del servicio y probar desde una ventana privada. Si se cambia cualquier `VITE_*`, volver a compilar/desplegar.

El nivel gratuito de Render puede suspender servicios inactivos y demorar el primer acceso. Disponibilidad, límites y condiciones de los niveles gratuitos pueden cambiar según el proveedor.

## Datos y privacidad

Se guardan nombre, apellido, curso, actividad, respuesta, fecha/hora, estado de revisión y las preguntas/respuestas del buzón sin identidad. No se guardan email, teléfono, dirección, ubicación ni ID de dispositivo. La ficha del alumno queda también en `localStorage` del navegador para evitar pedirla en cada visita.

Las respuestas escritas son visibles para la docente. Evitar pedir información íntima o datos sensibles en consignas. Los registros pueden eliminarse desde el panel. Supabase queda bajo la cuenta de la escuela; acordar el plazo de conservación y borrado con la institución.

## Pruebas y alcance

Comprobado en este entorno:

- `npm run lint`: correcto.
- `npm run build`: correcto; genera frontend de producción.
- `npm run test:api`: correcto con servidor en modo producción y código de prueba local (iniciado con `EXPEDIENTE2_CODE=SampleTestCode` y `EXPEDIENTE2_TOKEN_SECRET=temporary-test-secret`). Verifica que el contenido queda bloqueado sin permiso, rechaza código incorrecto, acepta el correcto, entrega Expediente 2 solo con token firmado, ignora un falso `reproductionUnlocked` enviado por el cliente, valida el fallback pedagógico desbloqueado y sirve el frontend.
- Inspección del bundle generado: el contenido del Expediente 2 y las claves de prueba no aparecen en JavaScript público.

No se pudo comprobar contra un proyecto Supabase/Render real porque requiere recursos y credenciales que debe crear la escuela. Por eso siguen pendientes las pruebas entre navegadores, inserciones/consultas RLS y el inicio de sesión docente conectado. Tampoco se verificó una llamada real a Gemini porque no se proporcionó `GEMINI_API_KEY`.
- El servicio de Gemini conserva su fallback local. Si falta la clave o Gemini falla, responde el clasificador pedagógico local.
- El desbloqueo y su permiso firmado funcionan en la API solo al configurar `SUPABASE_SERVICE_ROLE_KEY` y `EXPEDIENTE2_TOKEN_SECRET`. El código se genera desde el panel docente y solo se guarda hasheado en `app_settings`; el secreto de firma nunca es una variable `VITE_*`. Para pruebas locales sin Supabase se admite opcionalmente `EXPEDIENTE2_CODE` en `.env`.
- Por diseño, alumnos sin cuenta pueden introducir el nombre de otra persona; el panel refleja el nombre declarado, no verifica identidad.
