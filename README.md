# TaskFlow UNIOR

Proyecto del **Módulo 3 · Integración de Sistemas y Metodologías Profesionales**
(Diplomado en Desarrollo de Aplicaciones Full Stack, UNIOR).

| Carpeta | Qué es |
|---|---|
| `api/` | TaskFlow API del Módulo 2 (NestJS 12 + Prisma 7 + PostgreSQL), de Juan Carlos Condori Machicado ([original](https://gitlab.com/juanc.com/taskflow-nestjs-backend)) |
| `web/` | El front en Angular 22 + Angular Material |
| `compose.yml` | PostgreSQL para desarrollo |

## Levantar todo (desarrollo)

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
