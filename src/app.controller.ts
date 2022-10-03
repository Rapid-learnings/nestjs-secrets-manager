import { Controller, Get, Param } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * AppController is responsible for handling incoming requests specific to core application and returning responses to the client.
 * It is accessible on route - "/"
 */
@Controller()
export class AppController {
  /**
   * @param configService from '@nestjs/config'
   */
  constructor(private readonly configService: ConfigService) {}

  /**
   * Get API - "/secrets/:secretName" - it returns the secret value corresponding to the requested secretName from the loaded environment variables.
   * @param secretName name of the secret to fetch the value for.
   * @returns the value for the requested secret name.
   */
  @Get('secrets/:secretName')
  getSecret(@Param('secretName') secretName: string): string {
    return this.configService.get(secretName);
  }
}
