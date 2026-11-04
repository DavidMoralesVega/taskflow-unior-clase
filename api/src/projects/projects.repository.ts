import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateProjectDto } from './dto/create-project.dto.js';

@Injectable()
export class ProjectsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateProjectDto) {
    const { ownerId, ...projectData } = data;

    return this.prisma.project.create({
      data: {
        ...projectData,
        owner: {
          connect: { id: ownerId },
        },
      },
      include: {
        owner: true,
      },
    });
  }

  findAll() {
    return this.prisma.project.findMany({
      include: {
        owner: true,
      },
      orderBy: { id: 'desc' },
    });
  }

  findById(id: number) {
    return this.prisma.project.findUnique({
      where: { id },
      include: {
        owner: true,
        tasks: true,
      },
    });
  }
}