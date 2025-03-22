import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 5000;
  console.log(`Starting Nest.js application on port ${port}`);
  await app.listen(port);
  console.log(`Nest.js application is running on port ${port}`);
}
bootstrap();
