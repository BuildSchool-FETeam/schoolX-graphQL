import { forwardRef, Module } from '@nestjs/common'

import { TypeOrmModule } from '@nestjs/typeorm'
import { CommonModule } from 'src/common/Common.module'
import { CourseModule } from 'src/courses/Course.module'
import { EmailModule } from 'src/Email/email.module'
import { PermissionModule } from 'src/permission/permission.module'
import { Achievement } from './entities/Achivement.entity'
import { ClientUser } from './entities/ClientUser.entity'
import { AchievementTypeResolver } from './resolvers/achievementType.resolver'
import { ClientUserAuthMutationResolver } from './resolvers/clientUserAuthMutation.resolver'
import { ClientUserMutationResolver } from './resolvers/clientUserMutation.resolver'
import { clientUserQueryResolver } from './resolvers/clientUserQuery.resolver'
import { clientUserTypeResolver } from './resolvers/clientUserType.resolver'
import { AchievementService } from './services/achievement.service'
import { ClientAuthService } from './services/clientAuth.service'
import { ClientUserService } from './services/clientUser.service'

@Module({
  imports: [
    forwardRef(() => CommonModule),
    PermissionModule,
    TypeOrmModule.forFeature([ClientUser, Achievement]),
    EmailModule,
    forwardRef(() => CourseModule),
  ],
  providers: [
    ClientUserService,
    ClientAuthService,
    AchievementService,
    ClientUserAuthMutationResolver,
    ClientUserMutationResolver,
    clientUserQueryResolver,
    clientUserTypeResolver,
    AchievementTypeResolver,
  ],
  exports: [ClientUserService],
})
export class ClientUserModule {}
