import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt'
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private jwtService: JwtService

    ){
        //bcrypt.hash('123456789',10).then(console.log) //this function allowas you to generate the password for a user
    }

    async register(registerDto: RegisterDto){
        const existingUser = await this.usersRepository.findOne({
            where: {email: registerDto.email}
        })
        if(existingUser){
            throw new ConflictException('Email already in use! Please try a diff email')
        }

        const hashedPassword = await this.hashPassword(registerDto.password)
        const newlyCreatedUser = this.usersRepository.create({
            email: registerDto.email,
            name: registerDto.name,
            password: hashedPassword,
            role: UserRole.USER

        })

        const saveUser = await this.usersRepository.save(newlyCreatedUser);
        const {password, ...result} = saveUser;
        return {
            user: result,
            message: 'Register successful, login to continue'
        }
    }

    async createAdmin(registerDto: RegisterDto){
           const existingUser = await this.usersRepository.findOne({
            where: {email: registerDto.email}
        })
        if(existingUser){
            throw new ConflictException('Email already in use! Please try a diff email')
        }

        const hashedPassword = await this.hashPassword(registerDto.password)
        const newlyCreatedUser = this.usersRepository.create({
            email: registerDto.email,
            name: registerDto.name,
            password: hashedPassword,
            role: UserRole.ADMIN

        }) 
         const saveUser = await this.usersRepository.save(newlyCreatedUser);
        const {password, ...result} = saveUser;
        return {
            user: result,
            message: 'Admin created successfully, login to continue'
        }
    }

    async login(loginDto: LoginDto){
        const user = await this.usersRepository.findOne({
            where: {email: loginDto.email}
        })
        if(!user || !(await this.verifyPassword(loginDto.password, user.password))){
           throw new UnauthorizedException('Invalid credentials or account not exists')
        }

        //generate
        const tokens = this.generateToken(user)
        const {password, ...result} = user;
        return {
            user: result,
            ...tokens
        }
    }
    generateToken(user: User) {
        return {
            accessToken: this.generateAccessToken(user),
            refreshToken: this.generateRefreshToken(user)
        }
    }

    generateAccessToken(user: User): string{
       const payload = {
        email: user.email,
        sub: user.id,
        role: user.role
       }
       return this.jwtService.sign(payload,{
        secret: 'jwt_secret',
        expiresIn: '15m'
       });
    }

    // Find current user by ID
    async getUserById(userId: number){
       const user = await this.usersRepository.findOne({
        where:{id:userId}
       })
       if(!user){
        throw new UnauthorizedException('User not found!')
       }
       const {password, ...result} = user;
       return result;
    }

    async refreshToken(refreshToken: string){
        try {
            const payload = this.jwtService.verify(refreshToken,{
                secret: 'refresh_secret',
            })
            const user = await this.usersRepository.findOne({
                where: {id: payload.sub}
            })
            if(!user){
               throw new UnauthorizedException('Invalid token') 
            }
            const accessToken = this.generateAccessToken(user);
            return {accessToken}
            
        } catch (e) {
            throw new UnauthorizedException('Invalid token')
        }
    }

    generateRefreshToken(user: User): string{
        const payload = {
        email: user.email,
        sub: user.id,
        role: user.role
       }
       return this.jwtService.sign(payload,{
        secret: 'jwt_secret',
        expiresIn: '7d'
       });
    }
    private async verifyPassword(plainPassword: string, hashedPassword: string) : Promise<boolean>{
        return bcrypt.compare(plainPassword, hashedPassword)
    }

   private async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password,10);
    }
}
