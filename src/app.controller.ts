import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { awsConfigService } from './config/aws-config.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: awsConfigService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/firstPhrase')
  async getFirstPhrase(): Promise<string> {
    return await this.configService.get('PORT');
  }

  @Get('secondPhrase')
  async getSecondPhrase(): Promise<string> {
    return await this.configService.get('SOME_VAL');
  }

  @Get('threePhrase')
  getThreePhrase(): string {
    return this.configService.getStatic('SOME_VAL');
  }
}
