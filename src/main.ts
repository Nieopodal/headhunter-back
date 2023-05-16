import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { HttpExceptionFilter } from './common/filters/global-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe());
  app.use(helmet());
  app.use(cookieParser());
  app.enableCors({
    origin: configService.get('CORS_CLIENTS_URL'),
    credentials: true,
  });
  app.useGlobalFilters(new HttpExceptionFilter(configService));
  await app.listen(configService.get('PORT') ? parseInt(configService.get('PORT')) : 3000); // [BE] port: 3000
}

bootstrap();
