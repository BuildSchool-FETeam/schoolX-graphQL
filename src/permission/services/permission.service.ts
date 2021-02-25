import { PermissionSet } from '../entities/Permission.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Resource } from 'src/common/enums/resource.enum';
import _ from 'lodash';

type PermissionInput = {
  [key in Resource]: string;
};

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(PermissionSet)
    private permissionRepo: Repository<PermissionSet>,
  ) {}

  createAdminPermission() {
    const fullPerm = 'CRUD'.split('').join('|');
    const permissionSet = this.permissionRepo.create({
      course: fullPerm,
      blog: fullPerm,
      permission: fullPerm,
      user: fullPerm,
      instructor: fullPerm,
      notification: fullPerm,
    });

    return this.permissionRepo.save(permissionSet);
  }

  createPermission(input: PermissionInput) {
    const perSet = this.permissionRepo.create({
      ...input,
    });

    return this.permissionRepo.save(perSet);
  }

  async updatePermission(id: string, input: PermissionInput) {
    const permissionSet = await this.permissionRepo.findOne(id);

    _.forOwn(input, (value, key: Resource) => {
      permissionSet[key] = value;
    });

    return this.permissionRepo.save(permissionSet);
  }

  async deletePermission(id: string) {
    const permissionSet = this.permissionRepo.findOne(id);
    if (!permissionSet) {
      throw new Error('Permission Set does not exist');
    }
    await this.permissionRepo.delete({ id });
    return permissionSet;
  }
}
