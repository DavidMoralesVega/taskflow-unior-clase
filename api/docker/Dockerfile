FROM node:24-bookworm-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends build-essential python3 postgresql-client && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm ci

COPY . .

# Valor de ejemplo usado durante la generación del cliente.
# La aplicación recibirá la URL real en tiempo de ejecución.
ENV DATABASE_URL="postgresql://taskflow:build_placeholder@localhost:5432/taskflow"

RUN npx prisma generate

RUN npm run build

EXPOSE 3000

COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
