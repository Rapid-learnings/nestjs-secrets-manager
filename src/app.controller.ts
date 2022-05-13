import { Controller, Get, Param } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  @Get('secrets/:secretName')
  getSecret(@Param('secretName') secretName: string): string {
    return this.configService.get(secretName);
  }
}
