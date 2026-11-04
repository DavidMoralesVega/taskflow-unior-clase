import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength
} from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'El nombre debe ser texto.' })
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @MaxLength(100, {
    message: 'El nombre no puede superar los 100 caracteres.',
  })
  name: string;

  @IsEmail({}, {
    message: 'Debe proporcionar un correo electrónico válido.',
  })
  email!: string;

  @IsString({
    message: 'La contraseña debe ser texto.',
  })
  @MinLength(10, {
    message: 'La contraseña debe tener al menos 10 caracteres.',
  })
  passwordHash!: string;
}