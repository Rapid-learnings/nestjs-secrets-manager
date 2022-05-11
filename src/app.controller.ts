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
  async getSecret(@Param('secretName') secretName: string): Promise<string> {
    return await this.configService.get(secretName);
  }
}
