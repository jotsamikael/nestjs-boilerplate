import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Passport } from 'passport';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[
    //this will make the post repository available in the current scope
    TypeOrmModule.forFeature([User]),

    //passport module
    PassportModule,

    //configure jwt
    JwtModule.register({})
  ],
  controllers: [AuthController],
  providers: [AuthService], //jwt strategy, roles guard
  exports: [AuthService] //role -> guard
})
export class AuthModule {}
