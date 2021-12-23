import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { AdminUser } from 'src/adminUser/AdminUser.entity';
import { AdminUserService } from 'src/adminUser/services/AdminUser.service';
import * as _ from 'lodash';
import { AdminNotification } from '../Notification.entity';
import { NotificationService } from '../services/notification.service';

@Resolver('NotificationType')
export class NotificationTypeResolver {
  private readonly SEPARATOR = '|';

  constructor(
    private adminUserService: AdminUserService,
    private notificationService: NotificationService,
  ) {}

  @ResolveField()
  async recipientByAdmins(@Parent() parentNotification: AdminNotification) {
    let adminPromises: Array<Promise<AdminUser>> = [];

    if (_.size(parentNotification.recipientByAdminIds) > 0) {
      adminPromises = _.map(
        _.split(parentNotification.recipientByAdminIds, this.SEPARATOR),
        async (id) => this.adminUserService.findById(id),
      );

      const adminUsers = await Promise.all(adminPromises);

      return adminUsers;
    }

    return [];
  }

  @ResolveField()
  async createdBy(@Parent() notification: AdminNotification) {
    const notificationWithAdmin = await this.notificationService.findById(
      notification.id,
      { relations: ['createdBy'] },
    );

    return notificationWithAdmin.createdBy;
  }
}
