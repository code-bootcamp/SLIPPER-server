// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { Strategy } from 'passport-jwt';

// @Injectable()
// export class JWtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
//   constructor() {
//     super({
//       jwtFromRequest: (req) => {
//         return req.headers.cookie.replace('refreshToken=', '');
//       },
//       secretOrKey: 'myRefreshKey',
//     });
//   }

//   validate(payload) {
//     console.log(payload);
//     return {
//       id: payload.sub,
//       email: payload.email,
//     };
//   }
// }
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor() {
    super({
      jwtFromRequest: (req) => req.headers.cookie.replace('refreshToken=', ''),
      secretOrKey: 'myRefreshKey',
    });
  }
  validate(payload) {
    console.log(payload);
    return {
      id: payload.sub,
      email: payload.email,
    };
  }
}
