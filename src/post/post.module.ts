import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [PostService],
  controllers: [PostController],
  //This make the post repository available for injection
  //available in the current scope
  imports:[TypeOrmModule.forFeature([Post]), AuthModule]
})
export class PostModule {}
