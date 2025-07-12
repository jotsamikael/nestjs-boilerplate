import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreatePostDto{

    @IsNotEmpty({message: 'Title is required'})
    @IsString({message: 'Title must ba a string'})
    @MinLength(3, {message:'Must be atleast 3 characters long'})
    @MaxLength(50, {message:'Can not be more than 50 characters long'})
    title: string


      @IsNotEmpty({message: 'Title is required'})
    @IsString({message: 'Title must ba a string'})
    @MinLength(3, {message:'Must be atleast 3 characters long'})
    content: string


}