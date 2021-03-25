import { cacheConstant } from './../../common/constants/cache.contant';
import { CacheService } from './../../common/services/cache.service';
import { BaseService } from 'src/common/services/base.service';
import { RoleService } from '../../permission/services/role.service';
import { PermissionService } from '../../permission/services/permission.service';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordService } from 'src/common/services/password.service';
import { Repository } from 'typeorm';
import { AdminUser } from '../AdminUser.entity';
import { AdminUserSetInput } from 'src/graphql';
import * as _ from 'lodash';

@Injectable()
export class AdminUserService extends BaseService<AdminUser> {
  constructor(
    @InjectRepository(AdminUser)
    private userRepo: Repository<AdminUser>,
    private passwordService: PasswordService,
    private permissionService: PermissionService,
    private roleService: RoleService,
    private cacheService: CacheService
  ) {
    super(userRepo, 'AdminUser');
  }

  async createUserBySignup(data: Partial<AdminUser>) {
    const userCount = await this.userRepo.count();

    if (userCount > 0) {
      throw new BadRequestException('Only have one admin created by this way');
    }
    const permissionSet = this.permissionService.createAdminPermission();
    const role = await this.roleService.createAdminRole(permissionSet);
    permissionSet.role = role;
    await this.permissionService.savePermissionSet(permissionSet);
    const user = this.userRepo.create({
      ...data,
      password: this.passwordService.hash(data.password),
      role: role,
    });

    return this.userRepo.save(user);
  }

  async createUser(data: AdminUserSetInput) {
    const { name, email, password, role } = data;
    const existedRole = await this.roleService.findRoleByName(role);

    if (!existedRole) {
      throw new NotFoundException('This role is not existed');
    }
    const existedUser = await this.userRepo.find({ email });

    if (existedUser.length > 0) {
      throw new NotFoundException('This user email has been taken!');
    }

    if (!data.password) {
      throw new BadRequestException(
        'Cannot create an adminUser without password',
      );
    }

    const user = this.userRepo.create({
      email,
      name,
      role: existedRole,
      password: this.passwordService.hash(password),
    });

    return this.userRepo.save(user);
  }

  async updateUser(id: string, data: AdminUserSetInput) {
    const user = await this.userRepo.findOne(id);
    const role = await this.roleService.findRoleByName(data.role);

    if (!role) {
      throw new NotFoundException('Role not found');
    }
    if (!user) {
      throw new NotFoundException('User not found');
    }
    _.forOwn(data, (value, key) => {
      if (key === 'password' && value) {
        user[key] = this.passwordService.hash(value);
      } else {
        user[key] = value;
      }
    });
    user.role = role;

    return this.userRepo.save(user);
  }

  async findUserByEmail(email: string) {
    return this.userRepo.findOne({ email }, { relations: ['role'] });
  }

  async getAdminUserByToken (token: string) {
    const adminUser = await this.cacheService.getValue(cacheConstant.ADMIN_USER + '-' + token) as AdminUser;

    if (adminUser) {
      return adminUser
    }

    throw new ForbiddenException('Forbidden resource')
  }
}
