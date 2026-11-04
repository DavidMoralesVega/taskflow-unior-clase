import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateProjectDto {
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El nombre del proyecto es obligatorio.' })
  @MaxLength(150, {
    message: 'El nombre no puede superar los 150 caracteres.',
  })
  name: string;

  @IsOptional()
  @IsString({
    message: 'La descripción debe ser una cadena de texto.',
  })
  description?: string;

  @IsInt({ message: 'El ID del propietario debe ser un entero.' })
  @Min(1, { message: 'El ID del propietario debe ser mayor que cero.' })
  ownerId: number;
}