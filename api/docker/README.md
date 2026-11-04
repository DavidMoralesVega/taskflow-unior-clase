# Docker - Taskflow API

Esta carpeta contiene la configuración para levantar la API con **Docker Compose**.

## Estructura

```
docker/
├── Dockerfile
├── compose.yml
├── entrypoint.sh
├── .env
└── .env.sample
```

## Requisitos

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Variables de entorno

Antes de ejecutar, copia el archivo de ejemplo y ajusta los valores:

```bash
cp docker/.env.sample docker/.env
```

Edita `docker/.env` con tus valores:

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `POSTGRES_PASSWORD` | Contraseña de la base de datos | `mi_password_segura` |
| `DATABASE_URL` | URL de conexión a Postgres | `postgresql://taskflow:...@postgres:5432/taskflow` |
| `JWT_SECRET` | Secreto para firmar JWT | `cualquier_secreto_aleatorio` |
| `JWT_EXPIRES_IN` | Tiempo de expiración del token | `15m` |

⚠️ Nunca subas `docker/.env` con credenciales reales a control de versiones.

## Levantar los servicios

Desde la raíz del proyecto:

```bash
docker compose -f docker/compose.yml up --build
```

Desde la carpeta `docker/`:

```bash
cd docker
docker compose up --build
```

La API quedará disponible en: `http://localhost:3000`

## Comandos útiles

```bash
# Levantar en segundo plano
docker compose up -d --build

# Ver logs
docker compose logs -f api

# Detener y eliminar contenedores
docker compose down

# Detener y borrar volúmenes (¡borra la base de datos!)
docker compose down -v

# Reconstruir solo la API
docker compose build api
```

## ¿Qué hace el entrypoint?

El `entrypoint.sh` ejecuta, en orden:

1. Espera a que Postgres esté listo (`pg_isready`).
2. Aplica las migraciones de Prisma (`prisma migrate deploy`).
3. Arranca la aplicación (`node dist/main.js`).

## Notas

- El contexto de build es la **raíz del proyecto** (`..`), con el `Dockerfile` en `docker/Dockerfile`.
- La imagen base es `node:24-bookworm-slim` con `build-essential` y `python3` instalados (requerido por `bcrypt`).
- Los datos de Postgres persisten en el volumen `postgres_data`.
