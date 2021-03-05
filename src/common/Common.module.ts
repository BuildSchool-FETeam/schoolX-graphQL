import { TokenService } from './services/token.service';
import { AuthGuard } from './guards/auth.guard';
import { forwardRef, Module } from '@nestjs/common';
import { PasswordService } from './services/password.service';
import { PermissionModule } from 'src/permission/permission.module';
import { FileService } from './services/file.service';

@Module({
  imports: [forwardRef(() => PermissionModule)],
  providers: [PasswordService, TokenService, AuthGuard, FileService],
  exports: [PasswordService, AuthGuard, TokenService, FileService],
})
export class CommonModule {}
