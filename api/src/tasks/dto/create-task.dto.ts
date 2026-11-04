import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { TaskStatus } from '../../generated/prisma/client.js';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Preparar informe',
    description: 'Título de la tarea.',
  })
  @IsString({
    message: 'El título debe ser una cadena de texto.',
  })
  @MinLength(3, {
    message: 'El título debe tener al menos 3 caracteres.',
  })
  @MaxLength(100, {
    message: 'El título no puede superar los 100 caracteres.',
  })
  title: string;

  @ApiPropertyOptional({
    example: 'Completar el informe del proyecto',
    description: 'Descripción de la tarea.',
  })
  @IsString({
    message: 'La descripcion debe ser una cadena de texto.',
  })
  @IsOptional()
  description: string;

  @ApiPropertyOptional({
    enum: TaskStatus,
    example: TaskStatus.TODO,
    description: 'Columna del tablero: TODO, IN_PROGRESS o DONE.',
  })
  @IsEnum(TaskStatus, {
    message: 'El estado debe ser TODO, IN_PROGRESS o DONE.',
  })
  @IsOptional()
  status?: TaskStatus;
}
