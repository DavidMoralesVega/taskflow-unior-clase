import { Injectable, NotFoundException } from '@nestjs/common';
import { TasksRepository } from './tasks.repository.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { Task } from './types/task.type.js';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  async findAll(): Promise<Task[]> {
    return await this.tasksRepository.findAll();
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.tasksRepository.findById(id);

    if (!task) {
      throw new NotFoundException(`No existe una tarea con ID ${id}`);
    }

    return task;
  }

  async create(data: CreateTaskDto): Promise<Task> {
    return await this.tasksRepository.create({
      title: data.title,
      description: data.description,
      status: data.status,
    });
  }

  async update(id: number, data: UpdateTaskDto): Promise<Task | null> {
    await this.findOne(id);

    return this.tasksRepository.update(id, {
      ...(data.title !== undefined && {
        title: data.title,
      }),
      ...(data.description !== undefined && {
        description: data.description,
      }),
      ...(data.status !== undefined && {
        status: data.status,
      }),
    });
  }

  async remove(id: number): Promise<Task | null> {
   await this.findOne(id);
   return await this.tasksRepository.delete(id)
  }
}
