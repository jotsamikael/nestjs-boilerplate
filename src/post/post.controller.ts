import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { Post as PostEntity} from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorattor';
import { RolesGuard } from 'src/auth/guards/roles-guard';
import { UserRole } from 'src/auth/entities/user.entity';
import { Roles } from 'src/auth/decorators/role.decorators';
import { FindPostsQueryDto } from './dto/find-posts-query.dto';
import { PaginatedResponse } from 'src/common/interfaces/paginated-reponse.interfaces';

@Controller('post')
export class PostController {
    constructor(private readonly postService: PostService){

    }

    @UseGuards(JwtAuthGuard)
    @Post('')
    @HttpCode(HttpStatus.CREATED)
    async addPost(@Body() createPostData: CreatePostDto, @CurrentUser() user: any): Promise<PostEntity>{
     return this.postService.create(createPostData,user)
    }

    @Get()
   async getAllPosts(
    @Query() query : FindPostsQueryDto
   ): Promise<PaginatedResponse<PostEntity>>{
       return this.postService.getAllPosts(query);
    }


    @Get(':id')
    async findSingle(@Param('id', ParseIntPipe) id: number): Promise<PostEntity>{
        return this.postService.getSinglePost(id)
    }

    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() updatePostDto: UpdatePostDto, @CurrentUser() user: any): Promise<PostEntity>{
      return this.postService.update(id, updatePostDto, user)
    }

    @Roles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id', ParseIntPipe) id: number):Promise<void>{
        this.postService.deletePost(id)
    }
}
