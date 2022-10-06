import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/**
 * function for bootstraping the nest application
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
