import { UseGuards } from '@nestjs/common'
import { Resolver, Query, ResolveField, Context, Args } from '@nestjs/graphql'
import { PermissionRequire } from 'src/common/decorators/PermissionRequire.decorator'
import { AuthGuard } from 'src/common/guards/auth.guard'
import { PaginationInput, SearchOptionInput } from 'src/graphql'
import { NotificationService } from '../services/notification.service'

@UseGuards(AuthGuard)
@Resolver('NotificationQuery')
export class NotificationQueryResolver {
  constructor(private noticService: NotificationService) {}

  @Query()
  notificationQuery() {
    return {}
  }

  @PermissionRequire({ notification: ['R'] })
  @ResolveField('notificationsReceived')
  async getNotificationReceived(
    @Context() { req }: DynamicObject,
    @Args('pagination') pg: PaginationInput,
    @Args('searchOption') sOpt: SearchOptionInput
  ) {
    const token = this.noticService.getTokenFromHttpHeader(req.headers)
    const searchOpt = this.noticService.buildSearchOptions(sOpt)

    return this.noticService.getNotificationsReceived(token, searchOpt, pg)
  }

  @PermissionRequire({ notification: ['R'] })
  @ResolveField('notificationsSent')
  async getNotificationsSent(
    @Context() { req }: DynamicObject,
    @Args('pagination') pg: PaginationInput,
    @Args('searchOption') sOpt: SearchOptionInput
  ) {
    const token = this.noticService.getTokenFromHttpHeader(req.headers)
    const paginationOpt = this.noticService.buildPaginationOptions(pg)
    const searchOpt = this.noticService.buildSearchOptions(sOpt)

    return this.noticService.findWithOptions(
      {
        ...paginationOpt,
        ...searchOpt,
      },
      { token, strictResourceName: 'notification' }
    )
  }

  @PermissionRequire({ notification: ['R'] })
  @ResolveField('notification')
  async getNotification(
    @Context() { req }: DynamicObject,
    @Args('id') id: string
  ) {
    const token = this.noticService.getTokenFromHttpHeader(req.headers)

    return this.noticService.getNotificationById(token, id)
  }

  @PermissionRequire({ notification: ['R'] })
  @ResolveField()
  async totalNotificationReceived(@Context() { req }: DynamicObject) {
    const token = this.noticService.getTokenFromHttpHeader(req.headers)

    return this.noticService.countNotificationReceived(token)
  }

  @PermissionRequire({ notification: ['R'] })
  @ResolveField()
  async totalNotificationSent(@Context() { req }: DynamicObject) {
    const token = this.noticService.getTokenFromHttpHeader(req.headers)

    return this.noticService.countNotificationSent(token)
  }
}
