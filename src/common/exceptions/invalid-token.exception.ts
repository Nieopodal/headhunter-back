import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidTokenException extends HttpException {
  constructor() {
    super('Token jest nieprawidłowy lub wygasł', HttpStatus.UNAUTHORIZED);
  }
}
