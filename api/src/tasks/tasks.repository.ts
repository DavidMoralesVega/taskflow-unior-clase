import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import type { Task } from './types/task.type.js';

@Injectable()
export class TasksRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<Task[]> {
    return this.prisma.task.findMany({
      orderBy: { id: 'asc' },
    });
  }

  findById(id: number): Promise<Task | null> {
    return this.prisma.task.findUnique({
      where: { id },
    });
  }

  create(data: CreateTaskDto): Promise<Task> {
    return this.prisma.task.create({
      data,
    });
  }

  update(id: number, data: UpdateTaskDto): Promise<Task | null> {
    return this.prisma.task.update({
      where: { id },
      data,
    });
  }

  delete(id: number): Promise<Task> {
    return this.prisma.task.delete({
      where: { id },
    });
  }
}
