import { Post } from "src/post/entities/post.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum UserRole{
    USER = 'user',
    ADMIN = 'admin'
}

@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    email: string;

    @Column()
    name: string;

     @Column()
    password: string; //hash password

     @Column({
        type: 'enum',
        enum: UserRole,
        default: 'user'
     })
    role: UserRole;

    @OneToMany(()=>Post, (post)=>post.author)
    posts: Post[]

     @CreateDateColumn()
    createdDate: Date
    
    @UpdateDateColumn()
    updatedDate: Date    
    
}