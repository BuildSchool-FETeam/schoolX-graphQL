import { TokenService } from './services/token.service';
import { AuthGuard } from './guards/auth.guard';
import { forwardRef, Module } from '@nestjs/common';
import { PasswordService } from './services/password.service';
import { PermissionModule } from 'src/permission/permission.module';

@Module({
  imports: [forwardRef(() => PermissionModule)],
  providers: [PasswordService, TokenService, AuthGuard],
  exports: [PasswordService, AuthGuard, TokenService],
})
export class CommonModule {}
