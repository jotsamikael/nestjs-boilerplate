import { Injectable } from '@nestjs/common';
//business logic
@Injectable()
export class HelloService {
 getHello():string{
    return 'Hello Nest JS';
 }

  getHelloWithName(name:string):string{
    return `Hello ${name}`;
 }

}
