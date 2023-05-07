import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { JwtPayload } from '@Types';

@Injectable()
export class VtStrategy extends PassportStrategy(Strategy, 'jwt-verify-email') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'vt-secret',
    });
  }

  validate(payload: JwtPayload) {
    return payload;
  }
}
