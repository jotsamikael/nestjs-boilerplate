import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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
import { CacheModule } from '@nestjs/cache-manager';
import { FileUploadModule } from './file-upload/file-upload.module';
import { File } from './file-upload/entities/file.entity';
import { EventsModule } from './events/events.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

@Module({
  imports: [
    //file upload
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    //Caching
    CacheModule.register({
      isGlobal: true,
      ttl: 30000,
      max: 100
    }),
    //Rate limiting
    ThrottlerModule.forRoot([
      {ttl: 60000,
        limit:5
      }
    ]),
    //Orm
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'typescript',
      entities: [Post, User, File], //array of entities that you want to register
      synchronize: true, //dev mode
    }),

    ConfigModule.forRoot({
      isGlobal:true, //makes configmodule globally available
      /* validationSchema: joi.object({
        APP_NAME: joi.string().default('defaultApp'),
      }) */
     load:[appConfig]
    })
    ,HelloModule, UserModule, PostModule, AuthModule, FileUploadModule, EventsModule],
  controllers: [AppController, UserController],
  providers: [AppService, UserService],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
   // Apply middleware for all routes
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
  
}
