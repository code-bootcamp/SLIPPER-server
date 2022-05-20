import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JoinService } from '../join/join.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtservice: JwtService,
    private readonly joinservice: JoinService,
  ) {}

  getAccessToken({ user }) {
    return this.jwtservice.sign(
      { email: user.email, sub: user.id },
      { secret: 'myAccessKey', expiresIn: '20s' },
    );
  }

  setRefreshToken({ user, res }) {
    const refreshToken = this.jwtservice.sign(
      { email: user.email, sub: user.id },
      { secret: 'myRefreshKey', expiresIn: '2w' },
    );
    //res.setHeader('Set-Cookie', `refreshToken=${refreshToken}; path=/;`);
    // 배포환경
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader(
      'Set-Cookie',
      `refreshToken=${refreshToken}; path=/; domain=.backend.slipperofficial.shop; SameSite=None; Secure; httpOnly;`,
    );
  }

  async login({ req, res }) {
    let user = await this.joinservice.findOne({ email: req.user.email });
    if (!user) {
      user = await this.joinservice.createSocial({
        email: req.user.email,
        pw: req.user.pw,
        phone: req.user.phone,
        nickname: req.user.nickname,
      });
    }

    this.setRefreshToken({ user, res });
    //console.log(user);
  }
}
