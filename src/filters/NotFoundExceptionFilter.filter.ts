import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    NotFoundException,
} from '@nestjs/common';
import {Request, Response} from 'express';
import * as path from "path";

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
    catch(exception: NotFoundException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        response.sendFile(path.resolve('../../public_nodejs/public/index.html'))
    }
}