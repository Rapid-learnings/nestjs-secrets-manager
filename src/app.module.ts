import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: [`${process.env.NODE_ENV || ''}.env`],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
