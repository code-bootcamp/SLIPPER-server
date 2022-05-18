import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

@Injectable()
export class JWtRfreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor() {
    super({
      jwtFromRequest: (req) => {
        return req.headers.cookie.replace('refreshToken=', '');
      },
      secretOrKey: 'myRefresh',
    });
  }

}
