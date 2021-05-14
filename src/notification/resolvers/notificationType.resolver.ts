import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { AdminUser } from 'src/adminUser/AdminUser.entity';
import { AdminUserService } from 'src/adminUser/services/AdminUser.service';
import { AdminNotification } from '../Notification.entity';
import * as _ from 'lodash';

@Resolver('NotificationType')
export class NotificationTypeResolver {
  private readonly SEPARATOR = '|';

  constructor(private adminUserService: AdminUserService) {}

  @ResolveField()
  async recipientByAdmins(@Parent() parentNotification: AdminNotification) {
    let adminPromises: Array<Promise<AdminUser>> = [];

    if (_.size(parentNotification.recipientByAdminIds) > 0) {
      adminPromises = _.map(
        _.split(parentNotification.recipientByAdminIds, this.SEPARATOR),
        (id) => {
          return this.adminUserService.findById(id);
        },
      );

      const adminUsers = await Promise.all(adminPromises);
      return adminUsers;
    }

    return [];
  }
}
