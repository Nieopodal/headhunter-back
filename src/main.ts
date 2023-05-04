import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import {NotFoundExceptionFilter} from "./filters/NotFoundExceptionFilter.filter";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.enableCors({
    origin: 'mwyso.usermd.net',

    credentials: true,
  });
  app.useGlobalFilters(new NotFoundExceptionFilter());
  await app.listen(configService.get('PORT') ? parseInt(configService.get('PORT')) : 3000); // [BE] port: 3000
}

bootstrap();
