import { AuthGuard } from '@nestjs/passport';

export class VtGuard extends AuthGuard('jwt-verify-email') {
  constructor() {
    super();
  }
}
