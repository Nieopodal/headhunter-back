import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { JwtPayload } from '@Types';

@Injectable()
export class MtStrategy extends PassportStrategy(Strategy, 'jwt-email') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'mt-secret',
    });
  }

  validate(payload: JwtPayload) {
    return payload;
  }
}
