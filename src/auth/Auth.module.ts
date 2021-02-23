import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/Common.module';
import { AuthResolver } from './auth.resolver';
import { AdminUserModule } from 'src/AdminUser/AdminUser.module';

@Module({
  imports: [CommonModule, AdminUserModule],
  providers: [AuthResolver],
})
export class AuthModule { }
