import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminUserModule } from 'src/adminUser/AdminUser.module';
import { CommonModule } from 'src/common/Common.module';
import { PermissionModule } from 'src/permission/permission.module';
import { AdminNotification } from './Notification.entity';
import { NotificationMutationResolver } from './resolvers/notificationMutation.resolver';
import { NotificationQueryResolver } from './resolvers/notificationQuery.resolver';
import { NotificationSubscriptionResolver } from './resolvers/notificationSubscription.resolver';
import { NotificationTypeResolver } from './resolvers/notificationType.resolver';
import { NotificationService } from './services/notification.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminNotification]),
    CommonModule,
    AdminUserModule,
    PermissionModule,
  ],
  providers: [
    NotificationService,
    NotificationMutationResolver,
    NotificationQueryResolver,
    NotificationTypeResolver,
    NotificationSubscriptionResolver,
  ],
})
export class NotificationModule {}
