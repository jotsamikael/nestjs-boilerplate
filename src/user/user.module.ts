import { Module } from '@nestjs/common';
import { HelloModule } from 'src/hello/hello.module';

@Module({
      imports:[HelloModule]
    
})
export class UserModule {}
