import { Module } from '@nestjs/common'
import { CommonModule } from 'src/common/Common.module'
import { AdminUserModule } from 'src/adminUser/AdminUser.module'
import { AuthResolver } from './auth.resolver'

@Module({
  imports: [CommonModule, AdminUserModule],
  providers: [AuthResolver],
})
export class AuthModule {}
