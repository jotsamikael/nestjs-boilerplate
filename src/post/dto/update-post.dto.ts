import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdatePostDto {
  @IsOptional()
  @IsNotEmpty({ message: 'Title is required' })
  @IsString({ message: 'Title must ba a string' })
  @MinLength(3, { message: 'Must be atleast 3 characters long' })
  @MaxLength(50, { message: 'Can not be more than 50 characters long' })
  title?: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Title is required' })
  @IsString({ message: 'Title must ba a string' })
  @MinLength(3, { message: 'Must be atleast 3 characters long' })
  content?: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Author is required' })
  @IsString({ message: 'Author must ba a string' })
  @MinLength(3, { message: 'Must be atleast 3 characters long' })
  @MaxLength(25, { message: 'Can not be more than 50 characters long' })
  author?: string;
}
