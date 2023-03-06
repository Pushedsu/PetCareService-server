import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepository } from 'src/user/user.repository';
import { Request } from 'express';
import { Payload } from './jwt.payload';
@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly userRepository: UserRepository) {
    super({
      //JWT가 에서 추출되는 방법을 제공합니다 Request.
      //API 요청의 Authorization 헤더에 베어러 토큰을 제공하는 표준 접근 방식을 사용
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      //아래의 키는 절대 유출되어선 안됨!!
      secretOrKey: process.env.REFRESH_JWT_SECRET_KEY,
      passReqToCallback: true,
      ignoreExpiration: false,
    });
  }
  async validate(req: Request, payload: Payload) {
    const refreshToken = req.get('authorization').split('Bearer ')[1];
    const user = await this.userRepository.findUserByIdWithoutPassword(
      payload.sub,
    );
    const id = user.id;
    return { refreshToken, id };
  }
}
