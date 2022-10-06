import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';

import configuration from './app.config';

/**
 * It is the root module for the application in we import all feature modules and configure modules and packages that are common in feature modules.
 *
 * ConfigModule - enables us to access environment variables application wide. Here we also load the configuration from app.config file which will load the secrets in environment variables.
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
