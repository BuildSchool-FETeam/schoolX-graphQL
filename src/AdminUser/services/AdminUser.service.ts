import { RoleService } from '../../permission/services/role.service';
import { PermissionService } from '../../permission/services/permission.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordService } from 'src/common/services/password.service';
import { Repository, FindManyOptions } from 'typeorm';
import { AdminUser } from '../AdminUser.entity';
import { AdminUserSetInput } from 'src/graphql';
import * as _ from 'lodash';

@Injectable()
export class AdminUserService {
  constructor(
    @InjectRepository(AdminUser)
    private userRepo: Repository<AdminUser>,
    private passwordService: PasswordService,
    private permissionService: PermissionService,
    private roleService: RoleService,
  ) {}

  async createUserBySignup(data: Partial<AdminUser>) {
    const userCount = await this.userRepo.count();

    if (userCount > 0) {
      throw new Error('Only have one admin created by this way');
    }
    const permissionSet = await this.permissionService.createAdminPermission();
    const role = await this.roleService.createAdminRole(permissionSet);
    const user = this.userRepo.create({
      ...data,
      password: this.passwordService.hash(data.password),
      role: role,
    });

    return this.userRepo.save(user);
  }

  async createUser(data: AdminUserSetInput) {
    const { name, email, password, role } = data;
    const existedRole = await this.roleService.findRoleByOption(role);

    if (!role) {
      throw new BadRequestException('This role is not existed');
    }
    const existedUser = await this.userRepo.find({ email });

    if (existedUser.length > 0) {
      throw new BadRequestException('This user email has been taken!');
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

    if (!user) {
      throw new NotFoundException('User not found');
    }
    _.forOwn(user, (value, key) => {
      data[key] = value;
    });

    return this.userRepo.save(user);
  }

  async findUserById(id: string) {
    return this.userRepo.findOne(id);
  }

  async findUserByEmail(email: string) {
    return this.userRepo.findOne({ email }, { relations: ['role'] });
  }

  async findAllUser(options?: FindManyOptions<AdminUser>) {
    return this.userRepo.find(options);
  }
}
