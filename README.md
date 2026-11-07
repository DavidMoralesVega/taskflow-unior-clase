# TaskFlow UNIOR

Proyecto del **Módulo 3 · Integración de Sistemas y Metodologías Profesionales**
(Diplomado en Desarrollo de Aplicaciones Full Stack, UNIOR). Docente: David Morales Vega.

El repositorio avanza **clase por clase**: cada vez que terminamos una etapa, se sube aquí el código
de esa etapa, funcionando.

| Etapa | Clases | Qué agrega |
|---|---|---|
| **Unidad 1** (actual) | Sesión 1 (vie 6/11) y Sesión 2 (sáb 7/11) | Angular conectado a la API: registro, inicio de sesión, token JWT, tablero protegido |

| Carpeta | Qué es |
|---|---|
| `api/` | TaskFlow API del Módulo 2 (NestJS 12 + Prisma 7 + PostgreSQL), de Juan Carlos Condori Machicado ([original](https://gitlab.com/juanc.com/taskflow-nestjs-backend)) |
| `web/` | El front en Angular 22 + Angular Material |
| `compose.yml` | PostgreSQL para desarrollo |

## Levantar todo (desarrollo)

Necesitas Node 24.15+ (o 22.22.3+), Docker y Git.

```bash
docker compose up -d            # 1. base de datos (puerto 5433)

cd api
cp .env.sample .env             # 2. configuración de la API
npm install
npx prisma generate             # 3. el cliente de Prisma no viene en el repo
npx prisma migrate deploy       # 4. crea las tablas
npm run seed                    # 5. tareas de ejemplo
npm run start:dev               # 6. API en http://localhost:3000/api/docs

cd ../web                       # en otra terminal
npm install
npm start                       # 7. front en http://localhost:4200
```

Abre `http://localhost:4200`, crea una cuenta y verás las tres tareas del seed.

## Dónde está cada cosa (Unidad 1)

El recorrido de una petición, en el orden en que pasa:

```
login.ts ──► auth.ts ──► POST /api/auth/login ──► guarda el token (localStorage + signal)
board.ts ──► GET /api/v1/tasks ──► auth-interceptor.ts agrega "Authorization: Bearer <token>"
                                   └─► la API valida el token (JwtAuthGuard) ──► 200 con las tareas
```

### Front (`web/src/app/`)

| Archivo | Qué hace |
|---|---|
| `app.config.ts` | Arranque de la app: registra el router y `HttpClient` con el interceptor |
| `app.routes.ts` | Las rutas: `/login`, `/register` y `/` (el tablero, protegido por el guardián). Cada página se carga con `loadComponent` solo cuando se visita |
| `app.ts` · `app.html` | La barra superior; muestra **Cerrar sesión** solo si hay sesión |
| `core/auth.ts` | El servicio de sesión: `register()`, `login()`, `logout()`. Guarda el token en `localStorage` (sobrevive a la recarga) y en un signal (avisa a la pantalla) |
| `core/auth-interceptor.ts` | Agrega `Authorization: Bearer <token>` a cada petición. Si la API responde 401 teniendo token (vencido o falso), cierra la sesión |
| `core/auth-guard.ts` | Si no hay sesión, manda a `/login` antes de abrir el tablero. Es comodidad, no seguridad: la seguridad real está en la API |
| `core/error-message.ts` | Convierte cualquier error HTTP en una frase legible (incluye el caso «sin conexión / CORS») |
| `core/task.ts` | La forma de una tarea tal como la devuelve la API |
| `pages/login/` | Formulario con signals (`form`, `[formField]`) y validaciones |
| `pages/register/` | Crea la cuenta y después inicia sesión solo (el registro devuelve el usuario, no un token) |
| `pages/board/` | Pide las tareas con `httpResource` y muestra cargando, error o la lista |
| `../environments/` | `apiUrl`: la dirección de la API |

### API (`api/src/`)

| Archivo | Qué hace |
|---|---|
| `main.ts` | Prefijo `/api`, versionado (`/api/v1/...`), CORS desde `CORS_ORIGINS`, Swagger en `/api/docs` |
| `auth/auth.controller.ts` | `POST /api/auth/register` y `POST /api/auth/login` |
| `auth/auth.module.ts` | Firma el JWT con `JWT_SECRET`; dura lo que diga `JWT_EXPIRES_IN` (8 h en el `.env`) |
| `auth/guards/jwt-auth.guard.ts` | Valida el token en las rutas protegidas; sin token o con token falso → 401 |
| `auth/dto/` | Las reglas que debe cumplir el cuerpo del registro y del login |
| `tasks/` | `GET /api/v1/tasks` y el resto del CRUD de tareas |
| `../prisma/schema.prisma` · `seed.ts` | Las tablas y los datos de ejemplo |
| `../.env.sample` | Plantilla de configuración. El `.env` real **nunca** se sube a GitHub |

## Para probarlo

- **F12 → Application → Local Storage**: la clave `token`.
- **F12 → Network → `tasks` → Headers**: `Authorization: Bearer eyJ…`.
- Pega el token en [jwt.io](https://jwt.io): trae `sub`, `email` y `role`. Está **firmado, no cifrado**:
  cualquiera puede leerlo, nadie puede cambiarlo sin el `JWT_SECRET`.
- En la consola: `localStorage.setItem('token', 'falso')` y F5 → vuelves a `/login`.
