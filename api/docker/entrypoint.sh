#!/usr/bin/env bash
set -euo pipefail

echo "Esperando a Postgres..."
until pg_isready -h "${POSTGRES_HOST:-postgres}" -p "${POSTGRES_PORT:-5432}" -U "${POSTGRES_USER:-taskflow}" -d "${POSTGRES_DB:-taskflow}"; do
  sleep 2
done

echo "Aplicando migraciones de Prisma..."
npx prisma migrate deploy

echo "Iniciando la aplicacion..."
exec node dist/main.js
