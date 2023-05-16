import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private configService: ConfigService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    response.status(status).json({
      isSuccess: false,
      error: exception.message,
      status: status,
    });
  }
}
