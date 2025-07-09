import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

//root file ->entry point of nest js application

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //validate incoming request bodies automatically
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //strips propoerties that don't have decorators
      forbidNonWhitelisted: true,
      transform: true,//automatically transforms payloads to be objects typed according to their classes
      disableErrorMessages: false
    })
  )
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
