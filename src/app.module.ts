import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HelloModule } from './hello/hello.module';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { PostModule } from './post/post.module';
import * as joi from 'joi'
import appConfig from './config/appConfig';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post/entities/post.entity';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/entities/user.entity';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {ttl: 60000,
        limit:5
      }
    ]),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'typescript',
      entities: [Post, User], //array of entities that you want to register
      synchronize: true, //dev mode
    }),

    ConfigModule.forRoot({
      isGlobal:true, //makes configmodule globally available
      /* validationSchema: joi.object({
        APP_NAME: joi.string().default('defaultApp'),
      }) */
     load:[appConfig]
    })
    ,HelloModule, UserModule, PostModule, AuthModule],
  controllers: [AppController, UserController],
  providers: [AppService, UserService],
})
export class AppModule {}
