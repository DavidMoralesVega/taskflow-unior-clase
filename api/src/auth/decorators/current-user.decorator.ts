import {
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';

import { AuthRequest } from '../guards/jwt-auth.guard.js';

export const CurrentUser = createParamDecorator(
  (
    _data: unknown,
    context: ExecutionContext,
  ) => {
    const request = context
      .switchToHttp()
      .getRequest<AuthRequest>();

    return request.user;
  },
);