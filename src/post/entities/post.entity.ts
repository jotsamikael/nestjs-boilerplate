import { Column, CreateDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Post{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 50})
    title: string

     @Column({type: 'text'})
    content: string

     @Column()
    author: string

    @CreateDateColumn()
    createdDate: Date

    @UpdateDateColumn()
    updatedDate: Date
}