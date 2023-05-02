import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import {ValidationPipe} from '@nestjs/common';
import cookieParser from 'cookie-parser';
import {NotFoundExceptionFilter} from "./filters/NotFoundExceptionFilter.filter";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api');
  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.useGlobalFilters(new NotFoundExceptionFilter())
  app.enableCors({
    origin: [configService.get('CORS_CLIENTS_URL')],

    credentials: true,
  });
  await app.listen(configService.get('PORT') ? parseInt(configService.get('PORT')) : 3000); // [BE] port: 3000
}

bootstrap();
