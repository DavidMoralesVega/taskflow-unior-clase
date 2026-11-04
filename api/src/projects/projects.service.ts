import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto.js';
import { ProjectsRepository } from './projects.repository.js';
import { UsersRepository } from '../users/users.repository.js';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly projectsRepository: ProjectsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async create(dto: CreateProjectDto) {
    const owner = await this.usersRepository.findById(dto.ownerId);

    if (!owner) {
      throw new NotFoundException(
        `No existe el usuario propietario con ID ${dto.ownerId}.`,
      );
    }

    return this.projectsRepository.create(dto);
  }

  findAll() {
    return this.projectsRepository.findAll();
  }

  async findOne(id: number) {
    const project = await this.projectsRepository.findById(id);

    if (!project) {
      throw new NotFoundException(
        `No se encontró el proyecto con ID ${id}.`,
      );
    }

    return project;
  }
}