import { Resolver, Subscription } from '@nestjs/graphql';
import { SubscriptionService } from 'src/common/services/subscription.service';
import { AdminNotification } from '../Notification.entity';

@Resolver('NotificationSubscription')
export class NotificationSubscriptionResolver {
  constructor(private subService: SubscriptionService) {}

  @Subscription('notificationCreated', {
    async filter(
      { notificationCreated }: { notificationCreated: AdminNotification },
      variable: { adminUserId: string },
    ) {
      return notificationCreated.recipientByAdminIds.includes(
        variable.adminUserId,
      );
    },
  })
  async notificationCreated() {
    return this.subService.pubsub.asyncIterator(NOTIFICATION_CREATED);
  }
}

export const NOTIFICATION_CREATED = 'NOTIFICATION_CREATED';
