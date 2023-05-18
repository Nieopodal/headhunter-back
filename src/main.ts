import {NestFactory} from '@nestjs/core';
import {NestExpressApplication} from '@nestjs/platform-express';
import {ConfigService} from '@nestjs/config';
import {NotAcceptableException, ValidationPipe} from '@nestjs/common';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import {AppModule} from './app.module';
import {GlobalExceptionFilter} from './common/filters/global-exceptions.filter';
import {UnauthorizedExceptionFilter} from './common/filters/unauthorized-exception.filter';
import {NotFoundExceptionFilter} from "./filters/NotFoundExceptionFilter";

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    const configService = app.get(ConfigService);
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe());
    app.use(helmet());
    app.use(cookieParser());
    app.enableCors({
        origin: 'mwyso.usermd.net',
        credentials: true,
    });
// app.useGlobalFilters(new NotFoundExceptionFilter());
    app.useGlobalFilters(new UnauthorizedExceptionFilter());
    app.useGlobalFilters(new GlobalExceptionFilter(configService));
    await app.listen(configService.get('PORT') ? parseInt(configService.get('PORT')) : 3000);
}

bootstrap();
