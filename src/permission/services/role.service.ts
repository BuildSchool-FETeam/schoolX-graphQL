import { PermissionSet } from './../entities/Permission.entity';
import { Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from "../entities/Role.entity";

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepo: Repository<Role>
  ) { }

  createAdminRole (assignedPermission: PermissionSet) {
    const role = this.roleRepo.create({
      name: 'admin',
      permissionSet: assignedPermission
    })

    return this.roleRepo.save(role);
  }
}