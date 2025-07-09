import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { PostService } from './post.service';
import { Post as PostEntity} from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('post')
export class PostController {
    constructor(private readonly postService: PostService){

    }

    @Post('')
    @HttpCode(HttpStatus.CREATED)
    async addPost(@Body() createPostData: CreatePostDto): Promise<PostEntity>{
     return this.postService.create(createPostData)
    }

    @Get()
   async getAllPosts(): Promise<PostEntity[]>{
       return this.postService.getAllPosts();
    }


    @Get(':id')
    async findSingle(@Param('id', ParseIntPipe) id: number): Promise<PostEntity>{
        return this.postService.getSinglePost(id)
    }

    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() updatePostDto: UpdatePostDto): Promise<PostEntity>{
      return this.postService.update(id, updatePostDto)
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id', ParseIntPipe) id: number):Promise<void>{
        this.postService.deletePost(id)
    }
}
