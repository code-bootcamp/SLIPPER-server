import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';

@Injectable()
export class JwtKakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    super({
      clientID: process.env.KAKAO_ID,
      callbackURL: 'http://localhost:3000/login/kakao',
    });
  }

  validate(accessToken: string, refreshToken: string, profile: any) {
    console.log('엑세스', accessToken);
    console.log('리프레시', refreshToken);
    console.log(profile);
    return {
      email: profile._json.kakao_account.email,
      pw: '1111',
      nickname: profile.id,
      phone: '1111',
    };
  }
}
