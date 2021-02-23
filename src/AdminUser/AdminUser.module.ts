import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'src/common/Common.module';
import { PermissionModule } from 'src/permission/permission.module';
import { AdminUser } from './AdminUser.entity';
import { AdminUserService } from './services/AdminUser.service';

@Module({
  imports: [CommonModule, TypeOrmModule.forFeature([AdminUser]), PermissionModule],
  providers: [AdminUserService],
  exports: [AdminUserService],
})
export class AdminUserModule { }
