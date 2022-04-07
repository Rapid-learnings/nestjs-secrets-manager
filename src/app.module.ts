import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AwsConfigModule } from './config/aws-config.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env`],
      // isGlobal: true,
    }),
    AwsConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
