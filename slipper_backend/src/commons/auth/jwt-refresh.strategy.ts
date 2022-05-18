import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

@Injectable()
export class JwtRfreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor() {
    super({
      jwtFromRequest: (req) => {
        return req.headers.cookie.replace('refreshToken=', '');
      },
      secretOrKey: 'myRefreshKey',
    });
  }
  validate(req, payload) {
    return {
      id: payload.sub,
      email: payload.email,
    };
  }
}
