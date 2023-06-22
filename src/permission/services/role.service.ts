import { BaseService } from 'src/common/services/base.service'
import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindOneOptions, Repository } from 'typeorm'
import { PermissionSet } from '../entities/Permission.entity'
import { Role } from '../entities/Role.entity'

@Injectable()
export class RoleService extends BaseService<Role> {
  constructor(
    @InjectRepository(Role)
    private roleRepo: Repository<Role>
  ) {
    super(roleRepo, 'Role')
  }

  async createAdminRole(assignedPermission: PermissionSet) {
    const role = this.roleRepo.create({
      name: 'ultimateAdmin',
      permissionSet: assignedPermission,
    })

    return this.roleRepo.save(role)
  }

  async createRole(name: string) {
    const existedRole = await this.roleRepo.findOneBy({ name })

    if (existedRole) {
      throw new BadRequestException(
        'This name has been taken please choose another one'
      )
    }
    const newRole = this.roleRepo.create({
      name,
    })

    return this.roleRepo.save(newRole)
  }

  async updateRole(name: string, newName: string) {
    if (name !== newName) {
      throw new BadRequestException(
        'You cannot update a permission with new name, create a new one!!'
      )
    }
    const role = await this.findRoleByName(name)
    role.name = newName

    return this.roleRepo.save(role)
  }

  async deleteRoleByName(removedName: string) {
    try {
      await this.roleRepo
        .createQueryBuilder('roles')
        .delete()
        .where('name = :name', { name: removedName })
        .execute()
    } catch (err) {
      throw new InternalServerErrorException(err)
    }
  }

  async findRoleByName(name: string, options?: FindOneOptions<Role>) {
    return this.roleRepo.findOne({
      where: {
        name,
      },
      ...options,
    })
  }
}
