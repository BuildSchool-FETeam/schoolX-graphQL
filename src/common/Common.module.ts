import { TokenService } from './services/token.service';
import { AuthGuard } from './guards/auth.guard';
import { Module } from '@nestjs/common';
import { PasswordService } from './services/password.service';

@Module({
  providers: [PasswordService, TokenService, AuthGuard],
  exports: [PasswordService, AuthGuard, TokenService],
})
export class CommonModule { }
