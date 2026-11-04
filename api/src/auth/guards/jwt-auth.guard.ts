import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

export interface AuthUser {
  sub: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export type AuthRequest = Request & {
  user: AuthUser;
};

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<AuthRequest>();

    const authorization =
      request.headers.authorization;

    const [scheme, token] =
      authorization?.split(' ') ?? [];

    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException(
        'Debe iniciar sesión para acceder a este recurso.',
      );
    }

    try {
      request.user =
        await this.jwtService.verifyAsync<AuthUser>(
          token,
          {
            algorithms: ['HS256'],
          },
        );
    } catch {
      throw new UnauthorizedException(
        'El token es inválido o ha expirado.',
      );
    }

    return true;
  }
}