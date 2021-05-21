import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'src/common/Common.module';
import { PermissionModule } from 'src/permission/permission.module';
import { Achievement } from './entities/Achivement.entity';
import { ClientUser } from './entities/ClientUser.entity';
import { AchievementTypeResolver } from './resolvers/achievementType.resolver';
import { ClientUserAuthMutationResolver } from './resolvers/clientUserAuthMutation.resolver';
import { clientUserQueryResolver } from './resolvers/clientUserQuery.resolver';
import { clientUserTypeResolver } from './resolvers/clientUserType.resolver';
import { AchievementService } from './services/achievement.service';
import { ClientUserService } from './services/clientUser.service';

@Module({
  imports: [
    CommonModule,
    PermissionModule,
    TypeOrmModule.forFeature([ClientUser, Achievement]),
  ],
  providers: [
    ClientUserService,
    AchievementService,
    ClientUserAuthMutationResolver,
    clientUserQueryResolver,
    clientUserTypeResolver,
    AchievementTypeResolver,
  ],
})
export class ClientUserModule {}
