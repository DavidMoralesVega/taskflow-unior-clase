import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';

@Controller({
  path: 'health',
  version: '1',
})
export class HealthController {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  async check() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;

      return {
        status: 'ok',
        database: 'connected',
        timestamp: new Date().toISOString(),
      };
    } catch {
      throw new HttpException(
        {
          status: 'error',
          database: 'disconnected',
        },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}