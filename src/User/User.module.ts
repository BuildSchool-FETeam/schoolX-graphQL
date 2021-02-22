import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'src/common/Common.module';
import { PermissionModule } from 'src/permission/permission.module';
import { User } from './User.entity';
import { UserService } from './services/user.service';

@Module({
  imports: [CommonModule, TypeOrmModule.forFeature([User]), PermissionModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule { }
