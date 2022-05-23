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
import { BusinessUserModule } from './apis/businessUser/businessUser.module';

@Module({
  imports: [
    BusinessUserModule,
    JoinModule,
    AuthModule,
    TestAPIModule,
    CrontabModule,
    BoardModule,
    FileModule,

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/commons/graphql/schema.gql',
      context: ({ req, res }) => ({ req, res }),
      cors: {
        origin: true,
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
      url: 'redis://slipper-redis:6379',
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
