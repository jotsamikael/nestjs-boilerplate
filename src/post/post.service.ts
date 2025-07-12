import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User, UserRole } from 'src/auth/entities/user.entity';

@Injectable()
export class PostService {
constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>
){}



    async getAllPosts(): Promise<Post[]>{
     return this.postRepository.find(
        {
            relations:['authorName']
        }
     )
    }

    async getSinglePost(id:number):Promise<Post>{
        const singlePost = await this.postRepository.findOne({
            where: {id},
            relations:['authorName']
        })
       
        if(!singlePost){
            throw new NotFoundException(`Post with ${id} not found`)
        }
        return singlePost;
    }

    async create(createPostData: CreatePostDto,authorName: User): Promise<Post>{
         // and collecting all other properties into 'authorWithoutPassword'
         const { password, ...authorWithoutPassword } = authorName;
      const newPost=  this.postRepository.create({
            title: createPostData.title,
            content: createPostData.content,
            authorName: authorWithoutPassword
        })
        
        return this.postRepository.save(newPost);
    }


      async update(id: number,updatePostData: UpdatePostDto, user: User): Promise<Post>{
           let foundPost = await this.postRepository.findOneBy({id})
       
        if(!foundPost){
            throw new NotFoundException(`Post with ${id} not found`)
        }
         if(foundPost.authorName.id !== user.id || user.role !== UserRole.ADMIN){
            throw new ForbiddenException(`You can only update your own posts`)
        }

        if(updatePostData.title){
            foundPost.title == updatePostData.title;
        }
       
         if(updatePostData.content){
            foundPost.content == updatePostData.content;
        }

        return this.postRepository.save(foundPost);
    }

    async deletePost(id: number): Promise<void>{
        const findPostToDelete =  await this.getSinglePost(id)
        await this.postRepository.remove(findPostToDelete)
    }
}
