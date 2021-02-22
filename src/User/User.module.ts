import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'src/common/Common.module';
import { User } from './User.entity';
import { UserService } from './user.service';

@Module({
  imports: [CommonModule, TypeOrmModule.forFeature([User])],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
