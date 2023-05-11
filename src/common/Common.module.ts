import { CacheModule, forwardRef, Module } from '@nestjs/common'
import { PermissionModule } from 'src/permission/permission.module'
import { ConfigService } from '@nestjs/config'
import { ClientUserModule } from 'src/clientUser/clientUser.module'
import { ComplexQueryBuilderService } from './services/complexQueryBuilder.service'
import { CourseModule } from '../courses/Course.module'
import { CronService } from './services/cron.service'
import { TokenService } from './services/token.service'
import { AuthGuard } from './guards/auth.guard'
import { PasswordService } from './services/password.service'
import { FileService } from './services/file.service'
import { GCStorageService } from './services/GCStorage.service'
import { CacheService } from './services/cache.service'
import { SubscriptionService } from './services/subscription.service'
import { DateScalar } from './scalars/date.scalar'
import { ImageProcessService } from './services/imageProcess.service'

@Module({
  imports: [
    forwardRef(() => PermissionModule),
    forwardRef(() => CourseModule),
    forwardRef(() => ClientUserModule),
    CacheModule.register(),
  ],
  providers: [
    PasswordService,
    TokenService,
    AuthGuard,
    FileService,
    GCStorageService,
    ConfigService,
    CacheService,
    CronService,
    SubscriptionService,
    DateScalar,
    ImageProcessService,
    ComplexQueryBuilderService,
  ],
  exports: [
    PasswordService,
    AuthGuard,
    TokenService,
    FileService,
    GCStorageService,
    CacheService,
    SubscriptionService,
    ComplexQueryBuilderService,
  ],
})
export class CommonModule {}
