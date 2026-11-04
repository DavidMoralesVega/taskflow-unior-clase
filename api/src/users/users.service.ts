import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UsersRepository } from './users.repository.js';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}


  findByEmail(email: string) {
    return this.usersRepository.findByEmail(email);
  }

  async create(dto: CreateUserDto) {
    const existingUser = await this.usersRepository.findByEmail(dto.email);

    if (existingUser) {
      throw new ConflictException(
        'Ya existe un usuario con ese correo electrónico.',
      );
    }

    try {
      return await this.usersRepository.create(dto);
    } catch (error) {      
      // Evita duplicados incluso si dos solicitudes llegan
      // simultáneamente.
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
      }

      throw error;
    }
  }

  findAll() {
    return this.usersRepository.findAll();
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException(`No se encontró el usuario con ID ${id}.`);
    }

    return user;
  }
}
