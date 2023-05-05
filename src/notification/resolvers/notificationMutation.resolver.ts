import { UseGuards } from '@nestjs/common'
import {
  Args,
  Context,
  Mutation,
  ResolveField,
  Resolver,
} from '@nestjs/graphql'
import { PermissionRequire } from 'src/common/decorators/PermissionRequire.decorator'
import { AuthGuard } from 'src/common/guards/auth.guard'
import { SubscriptionService } from 'src/common/services/subscription.service'
import { TokenService } from 'src/common/services/token.service'
import { NotificationInput } from 'src/graphql'
import { NotificationService } from '../services/notification.service'
import { NOTIFICATION_CREATED } from './notificationSubscription.resolver'

@UseGuards(AuthGuard)
@Resolver('NotificationMutation')
export class NotificationMutationResolver {
  constructor(
    private notificationService: NotificationService,
    private tokenService: TokenService,
    private subService: SubscriptionService
  ) {}

  @Mutation()
  notificationMutation() {
    return {}
  }

  @PermissionRequire({ notification: ['C:*', 'R:*', 'U:x', 'D:x'] })
  @ResolveField()
  async createNotification(
    @Args('data') data: NotificationInput,
    @Context() { req }: DynamicObject
  ) {
    const token = this.notificationService.getTokenFromHttpHeader(req.headers)
    const notificationData = await this.notificationService.create(data, token)
    const channelId = this.subService.createChannelId(NOTIFICATION_CREATED)

    this.subService.pubsub.publish(channelId, {
      notificationCreated: notificationData,
    })

    return notificationData
  }

  @PermissionRequire({ notification: ['C:x', 'R:*', 'U:x', 'D:*'] })
  @ResolveField()
  async deleteByOwner(
    @Args('id') id: string,
    @Context() { req }: DynamicObject
  ) {
    const token = this.notificationService.getTokenFromHttpHeader(req.headers)

    await this.notificationService.deleteOneById(id, {
      token,
      strictResourceName: 'notification',
    })

    return true
  }

  @PermissionRequire({ notification: ['C:x', 'R:*', 'U:*', 'D:x'] })
  @ResolveField()
  async deleteByRecipient(
    @Args('id') id: string,
    @Context() { req }: DynamicObject
  ) {
    const token = this.notificationService.getTokenFromHttpHeader(req.headers)
    const { id: adminId } = await this.tokenService.getAdminUserByToken(token)

    await this.notificationService.deleteByRecipient(id, adminId)

    return true
  }
}
