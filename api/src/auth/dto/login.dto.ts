import {
  IsEmail,
  IsString,
  MaxLength,
} from 'class-validator';

export class LoginDto {
  @IsEmail({}, {
    message: 'Debe proporcionar un correo electrónico válido.',
  })
  email!: string;

  @IsString({
    message: 'La contraseña debe ser texto.',
  })
  @MaxLength(72, {
    message: 'La contraseña supera el límite admitido.',
  })
  password!: string;
}