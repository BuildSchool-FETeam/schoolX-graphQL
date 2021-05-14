import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/services/base.service';
import { CacheService } from 'src/common/services/cache.service';
import { TokenService } from 'src/common/services/token.service';
import { NotificationInput } from 'src/graphql';
import { FindManyOptions, Repository } from 'typeorm';
import { AdminNotification } from '../Notification.entity';
import * as _ from 'lodash';
import { RoleService } from 'src/permission/services/role.service';
import { Role } from 'src/permission/entities/Role.entity';

@Injectable()
export class NotificationService extends BaseService<AdminNotification> {
  private readonly SEPARATOR = '|';

  constructor(
    @InjectRepository(AdminNotification)
    protected noticRepo: Repository<AdminNotification>,
    protected cachingService: CacheService,
    private tokenService: TokenService,
    private roleService: RoleService,
  ) {
    super(noticRepo, 'notification', cachingService);
  }

  async create(data: NotificationInput, token: string) {
    const adminUser = await this.tokenService.getAdminUserByToken(token);
    const adminUserIdFromRole = await this.getAdminIdsFromRole(
      data.recipientByRoles,
    );

    const savedAdminUserIds = _.uniq([
      ...adminUserIdFromRole,
      ...(data.recipientByAdminIds || []),
    ]);
    const notic = this.noticRepo.create({
      title: data.title,
      content: data.content,
      recipientByAdminIds: _.join(savedAdminUserIds, this.SEPARATOR),
      createdBy: adminUser,
    });

    return this.noticRepo.save(notic);
  }

  async getNotification(
    adminToken: string,
    commonOptions: FindManyOptions<AdminNotification>,
  ) {
    const adminUser = await this.tokenService.getAdminUserByToken(adminToken);
    const notifications = await this.findWithOptions(commonOptions);

    return _.filter(notifications, (item) => {
      return _.includes(
        item.recipientByAdminIds.split(this.SEPARATOR),
        adminUser.id,
      );
    });
  }

  async deleteByRecipient(id: string, userId: string) {
    const notic = await this.findById(id);
    const listAdminIds = _.split(notic.recipientByAdminIds, this.SEPARATOR);

    _.remove(listAdminIds, (item) => item === userId);

    notic.recipientByAdminIds = listAdminIds.join('|');

    return this.noticRepo.save(notic);
  }

  private async getAdminIdsFromRole(roleNames: string[]) {
    let rolePromises: Array<Promise<Role>> = [];

    if (_.size(roleNames) > 0) {
      rolePromises = _.map(roleNames, (roleName) =>
        this.roleService.findRoleByName(roleName, {
          relations: ['adminUsers'],
        }),
      );
    }

    const adminUserIdFromRole: string[] = [];
    const roles = await Promise.all(rolePromises);

    _.each(roles, (role) => {
      adminUserIdFromRole.push(..._.map(role.adminUsers, 'id'));
    });

    return adminUserIdFromRole;
  }
}
