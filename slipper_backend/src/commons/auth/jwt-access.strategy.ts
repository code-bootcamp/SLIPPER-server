import {
  Injectable,
  CACHE_MANAGER,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Cache } from 'cache-manager';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cachManager: Cache,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'myAccessKey',
      passReqToCallback: true,
    });
  }

  async validate(req, payload) {
    const AccessToken = req.headers.authorization.replace('Bearer ', '');
    const redisAccessToken = await this.cachManager.get(AccessToken);
    if (redisAccessToken) throw new UnauthorizedException();
    console.log(payload);
    return {
      id: payload.sub,
      email: payload.email,
    };
  }
}
