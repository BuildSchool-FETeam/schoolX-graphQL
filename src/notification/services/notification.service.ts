import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { BaseService } from 'src/common/services/base.service'
import { CacheService } from 'src/common/services/cache.service'
import { TokenService } from 'src/common/services/token.service'
import { NotificationInput, PaginationInput } from 'src/graphql'
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm'
import * as _ from 'lodash'
import { RoleService } from 'src/permission/services/role.service'
import { Role } from 'src/permission/entities/Role.entity'
import { AdminNotification } from '../Notification.entity'

@Injectable()
export class NotificationService extends BaseService<AdminNotification> {
  private readonly SEPARATOR = '|'

  constructor(
    @InjectRepository(AdminNotification)
    protected noticRepo: Repository<AdminNotification>,
    protected cachingService: CacheService,
    private tokenService: TokenService,
    private roleService: RoleService
  ) {
    super(noticRepo, 'notification', cachingService)
  }

  async create(data: NotificationInput, token: string) {
    const adminUser = await this.tokenService.getAdminUserByToken(token)

    if (
      _.size(data.recipientByAdminIds) === 0 &&
      _.size(data.recipientByRoles) === 0
    ) {
      throw new BadRequestException(
        'You should enter at least one adminIds or recipients roles'
      )
    }

    const adminUserIdFromRole = await this.getAdminIdsFromRole(
      data.recipientByRoles
    )

    const savedAdminUserIds = _.uniq([
      ...adminUserIdFromRole,
      ...(data.recipientByAdminIds || []),
    ])
    const notic = this.noticRepo.create({
      title: data.title,
      content: data.content,
      recipientByAdminIds: _.join(savedAdminUserIds, this.SEPARATOR),
      createdBy: adminUser,
    })

    return this.noticRepo.save(notic)
  }

  async getNotificationsReceived(
    adminToken: string,
    searchOptions: FindManyOptions<AdminNotification>,
    paginationInput: PaginationInput
  ) {
    const notificationAdminReceived = await this.filterNotificationReceived(
      adminToken,
      searchOptions
    )

    return this.manuallyPagination(notificationAdminReceived, paginationInput)
  }

  private async filterNotificationReceived(
    adminToken: string,
    searchOptions: FindManyOptions<AdminNotification>
  ) {
    const adminUser = await this.tokenService.getAdminUserByToken(adminToken)
    const notifications = await this.findWithOptions(searchOptions)

    const notificationAdminReceived = _.filter(notifications, (item) =>
      _.includes(item.recipientByAdminIds.split(this.SEPARATOR), adminUser.id)
    )

    return notificationAdminReceived
  }

  async getNotificationById(
    adminToken: string,
    noticId: string,
    commonOptions?: FindOneOptions
  ) {
    const adminUser = await this.tokenService.getAdminUserByToken(adminToken)
    const notification = await this.findById(noticId, commonOptions)

    if (!notification.recipientByAdminIds.includes(adminUser.id)) {
      throw new ForbiddenException('This notification is not for you!!')
    }

    return notification
  }

  async deleteByRecipient(id: string, userId: string) {
    const notic = await this.findById(id)
    const listAdminIds = _.split(notic.recipientByAdminIds, this.SEPARATOR)

    _.remove(listAdminIds, (item) => item === userId)
    notic.recipientByAdminIds = listAdminIds.join('|')

    return this.noticRepo.save(notic)
  }

  async countNotificationReceived(adminToken: string) {
    const notic = await this.filterNotificationReceived(adminToken, {})

    return _.size(_.uniqBy(notic, 'id'))
  }

  async countNotificationSent(adminToken: string) {
    const adminUser = await this.tokenService.getAdminUserByToken(adminToken)

    return this.noticRepo
      .createQueryBuilder('notic')
      .where('notic.createdById = :id', { id: adminUser.id })
      .getCount()
  }

  private async getAdminIdsFromRole(roleNames: string[]) {
    let rolePromises: Array<Promise<Role>> = []

    if (_.size(roleNames) > 0) {
      rolePromises = _.map(roleNames, async (roleName) =>
        this.roleService.findRoleByName(roleName, {
          relations: { adminUsers: true },
        })
      )
    }
    const adminUserIdFromRole: string[] = []
    const roles = await Promise.all(rolePromises)

    _.each(roles, (role) => {
      adminUserIdFromRole.push(..._.map(role.adminUsers, 'id'))
    })

    return adminUserIdFromRole
  }
}
