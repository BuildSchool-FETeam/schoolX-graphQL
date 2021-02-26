import { BaseService } from 'src/common/services/base.service';
import { PermissionSet } from './../entities/Permission.entity';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOneOptions,
  Repository,
} from 'typeorm';
import { Role } from '../entities/Role.entity';

@Injectable()
export class RoleService extends BaseService<Role> {
  constructor(
    @InjectRepository(Role)
    private roleRepo: Repository<Role>,
  ) {
    super(roleRepo)
  }

  createAdminRole (assignedPermission: PermissionSet) {
    const role = this.roleRepo.create({
      name: 'ultimateAdmin',
      permissionSet: assignedPermission,
    });

    return this.roleRepo.save(role);
  }

  async createRole (name: string) {
    const existedRole = await this.roleRepo.findOne({ name });

    if (existedRole) {
      throw new BadRequestException('This name has been taken please choose another one');
    }
    const newRole = this.roleRepo.create({
      name,
    });

    return this.roleRepo.save(newRole);
  }

  async updateRole (name: string, newName: string) {
    return this.roleRepo.update({ name }, {
      name: newName
    })
  }

  async findRoleByName (name: string, options?: FindOneOptions<Role>) {
    return this.roleRepo.findOne({ name }, options);
  }
}
