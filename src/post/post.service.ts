import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { QueryBuilder, Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User, UserRole } from 'src/auth/entities/user.entity';
import { FindPostsQueryDto } from './dto/find-posts-query.dto';
import { PaginatedResponse } from 'src/common/interfaces/paginated-reponse.interfaces';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';


@Injectable()
export class PostService {
    private postListCacheKeys: Set<string> = new Set();
    constructor(
        @InjectRepository(Post)
        private postRepository: Repository<Post>,
        //Inject cache manager
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) { }

    private generatePostListCacheKey(query: FindPostsQueryDto): string {
        const { page = 1, limit = 10, title } = query;
        return `posts_list_page${page}_limit${limit}_title${title || 'all'}`;
    }

    async getAllPosts(query: FindPostsQueryDto): Promise<PaginatedResponse<Post>> {
        const cacheKey = this.generatePostListCacheKey(query);

        this.postListCacheKeys.add(cacheKey)

        const getCachedData = await this.cacheManager.get<PaginatedResponse<Post>>(cacheKey);

        if (getCachedData) {
            console.log(`Cache Hit---------> Returning post list from Cache ${cacheKey}`)
            return getCachedData
        }
        console.log(`Cache Miss---------> Returning post list from database`)
        const { page = 1, limit = 10, title } = query;
        const skip = (page - 1) * limit;
        const queryBuilder = this.postRepository.createQueryBuilder('post')
            .leftJoinAndSelect('post.authorName', 'authorName').orderBy('post.createdDate', 'DESC').skip(skip).take(limit)

        if (title) {
            queryBuilder.andWhere('post.title ILIKE :title', { title: `%${title}%` })
        }

        const [items, totalItems] = await queryBuilder.getManyAndCount();

        const totalPages = Math.ceil(totalItems / limit);

        const responseResult = {
            items,
            meta: {
                currentPage: page,
                itemsPerPage: limit,
                totalItems,
                totalPages,
                hasPreviousPage: page > 1,
                hasNextPage: page < totalPages
            }
        }
        await this.cacheManager.set(cacheKey, responseResult, 30000);
        return responseResult;

    }

    async getSinglePost(id: number): Promise<Post> {
    //create cachekey 
    const cacheKey = `post_${id}`
    const cachedPost = await this.cacheManager.get<Post>(cacheKey)
    if(cachedPost){
           console.log(`Cache Hit---------> Returning post  from Cache ${cacheKey}`)
            return cachedPost 
    }
        console.log(`Cache Miss---------> Returning post from database`)


        const singlePost = await this.postRepository.findOne({
            where: { id },
            relations: ['authorName']
        })

        if (!singlePost) {
            throw new NotFoundException(`Post with ${id} not found`)
        }

        //store the post to cache
        await this.cacheManager.set(cacheKey, singlePost, 30000)
        return singlePost;
    }

    async create(createPostData: CreatePostDto, authorName: User): Promise<Post> {
        // and collecting all other properties into 'authorWithoutPassword'
        const { password, ...authorWithoutPassword } = authorName;
        const newPost = this.postRepository.create({
            title: createPostData.title,
            content: createPostData.content,
            authorName: authorWithoutPassword
        })

        //invalid the existing cache
        await this.invalidateAllExistingListCaches()

        return this.postRepository.save(newPost);
    }


    async update(id: number, updatePostData: UpdatePostDto, user: User): Promise<Post> {
        let foundPost = await this.postRepository.findOneBy({ id })

        if (!foundPost) {
            throw new NotFoundException(`Post with ${id} not found`)
        }
        if (foundPost.authorName.id !== user.id || user.role !== UserRole.ADMIN) {
            throw new ForbiddenException(`You can only update your own posts`)
        }

        if (updatePostData.title) {
            foundPost.title == updatePostData.title;
        }

        if (updatePostData.content) {
            foundPost.content == updatePostData.content;
        }

        const updatedPost = await this.postRepository.save(foundPost);
        await this.cacheManager.del(`post_${id}`)
        //invalid the existing cache
        await this.invalidateAllExistingListCaches()

        return updatedPost;
    }

    async deletePost(id: number): Promise<void> {
        const findPostToDelete = await this.getSinglePost(id)
        await this.postRepository.remove(findPostToDelete)

        await this.cacheManager.del(`post_${id}`)
        //invalid the existing cache
        await this.invalidateAllExistingListCaches()
    }

    private async invalidateAllExistingListCaches(): Promise<void> {
       console.log(`Invalidating ${this.postListCacheKeys.size} list cache entries`);
       for(const key of this.postListCacheKeys){
        await this.cacheManager.del(key)
       }

       this.postListCacheKeys.clear()
    }
}
