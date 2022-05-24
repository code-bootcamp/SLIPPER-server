import { CacheModule, Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';

// API Modules
import { TestAPIModule } from './apis/testAPI/test.module';
import { BoardModule } from './apis/Board/board.module';
import { FileModule } from './apis/file/file.module';
import { CrontabModule } from './apis/crontab/crontab.module';
import { JoinModule } from './apis/join/join.module';
import { AuthModule } from './apis/auth/auth.module';
import { PaymentModule } from './apis/Payment/payment.module';
import { BusinessUserModule } from './apis/businessBoard/businessUser.module';

@Module({
  imports: [
    BusinessUserModule,
    JoinModule,
    AuthModule,
    TestAPIModule,
    CrontabModule,
    BoardModule,
    FileModule,
    PaymentModule,

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/commons/graphql/schema.gql',
      context: ({ req, res }) => ({ req, res }),
      cors: {
        origin: 'http://localhost:3000',
        Credential: true,
      },
    }),

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.FOR_ROOT_HOST,
      port: 3306,
      username: process.env.FOR_ROOT_USERNAME,
      password: process.env.FOR_ROOT_PASSWORD,
      database: process.env.FOR_ROOT_DATABASE,
      entities: [__dirname + '/apis/**/*.entity.*'],
      synchronize: true,
      logging: true,
      retryAttempts: 30,
      retryDelay: 5000,
    }),

    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      url: process.env.REDIS_IP,
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
