import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAccessStrategy } from 'src/commons/auth/jwt-access.strategy';
import { Join } from './entities/join.entity';
import { JoinResolver } from './join.resolver';
import { JoinService } from './join.service';

@Module({
  imports: [TypeOrmModule.forFeature([Join])],
  providers: [
    JwtAccessStrategy,
    JoinResolver, //
    JoinService,
  ],
})
export class JoinModule {}
