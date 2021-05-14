import { UseGuards } from '@nestjs/common';
import { Resolver, Query, ResolveField, Context, Args } from '@nestjs/graphql';
import { PermissionRequire } from 'src/common/decorators/PermissionRequire.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { PaginationInput, SearchOptionInput } from 'src/graphql';
import { NotificationService } from '../services/notification.service';

@UseGuards(AuthGuard)
@Resolver('NotificationQuery')
export class NotificationQueryResolver {
  constructor(private noticService: NotificationService) {}

  @Query()
  notificationQuery() {
    return {};
  }

  @PermissionRequire({ notification: ['R'] })
  @ResolveField('notifications')
  getAllNotifications(
    @Context() { req }: any,
    @Args('pagination') pg: PaginationInput,
    @Args('searchOption') sOpt: SearchOptionInput,
  ) {
    const token = this.noticService.getTokenFromHttpHeader(req.headers);
    const paginationOpt = this.noticService.buildPaginationOptions(pg);
    const searchOpt = this.noticService.buildSearchOptions(sOpt);

    return this.noticService.getNotification(token, {
      ...paginationOpt,
      ...searchOpt,
    });
  }
}
