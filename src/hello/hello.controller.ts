import { Controller, Get, Param, Query } from '@nestjs/common';
import { HelloService } from './hello.service';

//handle incoming request from clients and send response
//Use dependency injection to consume services
//All business logic is in the service the controller only consumes the service's function

//localhost:3000/hello
@Controller('hello')
export class HelloController {
    //dependency injection
   constructor(private readonly helloService: HelloService){

   }

   @Get('/first-route')
   getHello():string{
    return this.helloService.getHello();
   }

     @Get('/user/:name')
   getHelloWithName(@Param('name') name:string):string{
    return this.helloService.getHelloWithName(name);
   }

   //hello/query?
    @Get('query')
   getHelloWithQuery(@Query('name') name:string):string{
    return this.helloService.getHelloWithName(name);
   }
}
