import { Injectable } from '@nestjs/common';
import { HelloService } from 'src/hello/hello.service';

@Injectable()
export class UserService {
    //injecting service from another module
    //Hello module must export helloservice
    //User module must import hello module 
    constructor(private readonly helloService: HelloService){

    }
    getAllUsers(){
        return [
            {
                id: 1,
                name: "Atanga"
            },
             {
                id: 2,
                name: "Bessala"
            },
             {
                id: 3,
                name: "Cheick"
            },
             {
                id: 4,
                name: "Dogmo"
            }
        ]
    }

    getUserById(id: number){
        const user = this.getAllUsers().find(user=>user.id === id);
        return user;
    }

    getWlcomeMessage(idUser: number){
        const user = this.getUserById(idUser)
        if(!user){
            return 'User not found'
        }
        return this.helloService.getHelloWithName(user?.name);
    }
}

