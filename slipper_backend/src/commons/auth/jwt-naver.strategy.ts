import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-naver-v2';

@Injectable()
export class JwtNaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor() {
    super({
      clientID: process.env.NAVER_ID,
      clientSecret: process.env.NAVERSECRET,
      callbackURL: 'http://localhost:3000/login/naver',
      scope: ['email', 'profile'],
    });
  }

  validate(accessToken: string, refreshToken: string, profile: any) {
    console.log('엑세스', accessToken);
    console.log('리프레시', refreshToken);
    console.log(profile.email);
    return {
      email: profile.email,
      pw: '1111',
      nickname: profile.id,
      phone: '1111',
    };
  }
}
