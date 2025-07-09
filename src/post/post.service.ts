import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>
){}



    async getAllPosts(): Promise<Post[]>{
     return this.postRepository.find()
    }

    async getSinglePost(id:number):Promise<Post>{
        const singlePost = await this.postRepository.findOneBy({id})
       
        if(!singlePost){
            throw new NotFoundException(`Post with ${id} not found`)
        }
        return singlePost;
    }

    async create(createPostData: CreatePostDto): Promise<Post>{
      const newPost=  this.postRepository.create({
            title: createPostData.title,
            author: createPostData.author,
            content: createPostData.content
        })

        return this.postRepository.save(newPost);
    }


      async update(id: number,updatePostData: UpdatePostDto): Promise<Post>{
           let foundPost = await this.postRepository.findOneBy({id})
       
        if(!foundPost){
            throw new NotFoundException(`Post with ${id} not found`)
        }

        if(updatePostData.title){
            foundPost.title == updatePostData.title;
        }
         if(updatePostData.author){
            foundPost.author == updatePostData.author;
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
