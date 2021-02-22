import { PermissionSet } from '../entities/Permission.entity';
import { Repository } from 'typeorm';
import { Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(PermissionSet)
    private permissionRepo: Repository<PermissionSet>
  ) { }

  createAdminPermission () {
    const fullPerm = 'CRUD'.split('').join('|')
    const permissionSet = this.permissionRepo.create({
      course: fullPerm,
      blog: fullPerm,
      permission: fullPerm,
      user: fullPerm,
      instructor: fullPerm,
      notification: fullPerm,
    })

    return this.permissionRepo.save(permissionSet);
  }
}