import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';

@Module({
  providers: [PostService],
  controllers: [PostController],
  //This make the post repository available for injection
  //available in the current scope
  imports:[TypeOrmModule.forFeature([Post])]
})
export class PostModule {}
