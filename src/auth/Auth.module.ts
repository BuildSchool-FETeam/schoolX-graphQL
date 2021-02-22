import { AuthService } from './services/auth.service';
import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/Common.module';
import { AuthResolver } from './auth.resolver';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [CommonModule, UserModule],
  providers: [AuthResolver, AuthService],
})
export class AuthModule { }
