import { RoleService } from '../../permission/services/role.service';
import { PermissionService } from '../../permission/services/permission.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordService } from 'src/common/services/password.service';
import { Repository, FindManyOptions } from 'typeorm';
import { AdminUser } from '../AdminUser.entity';

@Injectable()
export class AdminUserService {
  constructor(
    @InjectRepository(AdminUser)
    private userRepo: Repository<AdminUser>,

    private passwordService: PasswordService,
    private permissionService: PermissionService,
    private roleService: RoleService
  ) { }

  async createUserBySignup (data: Partial<AdminUser>) {
    const userCount = await this.userRepo.count();

    if (userCount > 0) {
      throw new Error('Only have one admin created by this way')
    }
    const permissionSet = await this.permissionService.createAdminPermission()
    const role = await this.roleService.createAdminRole(permissionSet);
    const user = this.userRepo.create({
      ...data,
      password: this.passwordService.hash(data.password),
      role: role
    });

    return this.userRepo.save(user);
  }

  async findUserById (id: string) {
    return this.userRepo.findOne(id);
  }

  async findUserByEmail (email: string) {
    return this.userRepo.findOne({ email }, { relations: ['role'] })
  }

  async findAllUser (options?: FindManyOptions<AdminUser>) {
    return this.userRepo.find(options);
  }
}
