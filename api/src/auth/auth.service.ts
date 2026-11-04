import { Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { UnauthorizedException } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const email = dto.email.trim().toLowerCase();

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = await this.usersService.create({
      name: dto.name.trim(),
      email,
      passwordHash,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  async login(dto: LoginDto) {
    const email = dto.email.trim().toLowerCase();

    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas.');
    }

    if (!user.passwordHash) {
      throw new UnauthorizedException('Credenciales incorrectas.');
    }

    const isValid = await bcrypt.compare(dto.password, user.passwordHash);

    if (!isValid) {
      throw new UnauthorizedException('Credenciales incorrectas.');
    }

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      access_token: accessToken,
      token_type: 'Bearer',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
