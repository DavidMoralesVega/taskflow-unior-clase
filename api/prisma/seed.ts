import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, TaskStatus } from '../src/generated/prisma/client.js';

async function main() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL no está configurada');
  }

  const adapter = new PrismaPg({
    connectionString,
  });

  const prisma = new PrismaClient({ adapter });

  try {
    const tasks = [
      {
        title: 'Preparar documentación',
        description: 'Documentar los endpoints de TaskFlow',
        status: TaskStatus.TODO,
      },
      {
        title: 'Implementar autenticación',
        description: 'Preparar la autenticación de usuarios',
        status: TaskStatus.IN_PROGRESS,
      },
      {
        title: 'Escribir pruebas unitarias',
        description: 'Probar los servicios de la API',
        status: TaskStatus.DONE,
      },
    ];

    for (const task of tasks) {
      const existingTask = await prisma.task.findFirst({
        where: { title: task.title },
      });

      if (!existingTask) {
        await prisma.task.create({
          data: task,
        });
      }
    }

    console.log('Seed ejecutado correctamente');
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error('Error al ejecutar el seed:', error);
  process.exitCode = 1;
});