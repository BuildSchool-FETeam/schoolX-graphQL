import { BaseService, IStrictConfig } from 'src/common/services/base.service'
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PasswordService } from 'src/common/services/password.service'
import { Repository } from 'typeorm'
import { AdminUserSetInput } from 'src/graphql'
import * as _ from 'lodash'
import { PermissionService } from 'src/permission/services/permission.service'
import { TokenService } from 'src/common/services/token.service'
import { CacheService } from 'src/common/services/cache.service'
import { RoleService } from 'src/permission/services/role.service'
import { AdminUser } from '../AdminUser.entity'

@Injectable()
export class AdminUserService extends BaseService<AdminUser> {
  constructor(
    @InjectRepository(AdminUser)
    private userRepo: Repository<AdminUser>,
    private passwordService: PasswordService,
    private permissionService: PermissionService,
    private roleService: RoleService,
    @Inject(forwardRef(() => TokenService))
    private tokenService: TokenService,
    public cachedService: CacheService
  ) {
    super(userRepo, 'AdminUser', cachedService)
  }

  async validateEmail(email: string) {
    const existUser = await this.findUserByEmail(email)

    return _.isNull(existUser)
  }

  async createUserBySignup(data: Partial<AdminUser>) {
    const userCount = await this.userRepo.count()

    if (userCount > 0) {
      throw new BadRequestException('Only have one admin created by this way')
    }
    const permissionSet = this.permissionService.createAdminPermission()
    const role = await this.roleService.createAdminRole(permissionSet)
    permissionSet.role = role
    await this.permissionService.savePermissionSet(permissionSet)
    const user = this.userRepo.create({
      ...data,
      password: this.passwordService.hash(data.password),
      role,
    })

    return this.userRepo.save(user)
  }

  async createUser(data: AdminUserSetInput, token: string) {
    const { name, email, password, role } = data
    const existedRole = await this.roleService.findRoleByName(role)

    if (!existedRole) {
      throw new NotFoundException('This role is not existed')
    }
    const existedUser = await this.userRepo.find({
      where: {
        email,
      },
    })

    if (existedUser.length > 0) {
      throw new NotFoundException('This user email has been taken!')
    }

    if (!data.password) {
      throw new BadRequestException(
        'Cannot create an adminUser without password'
      )
    }

    const adminUser = await this.tokenService.getUserByToken(token)

    const user = this.userRepo.create({
      email,
      name,
      role: existedRole,
      password: this.passwordService.hash(password),
      createdBy: adminUser,
    })

    return this.userRepo.save(user)
  }

  async updateUser(
    id: string,
    data: AdminUserSetInput,
    strictConfig: IStrictConfig
  ) {
    const [user, role] = await Promise.all([
      this.findById(id, {}, strictConfig),
      this.roleService.findRoleByName(data.role),
    ])

    if (!role) {
      throw new NotFoundException('Role not found')
    }
    if (!user) {
      throw new NotFoundException('User not found')
    }
    _.forOwn(data, (value, key) => {
      if (key === 'password' && value) {
        user[key] = this.passwordService.hash(value)
      } else {
        user[key] = value
      }
    })
    user.role = role

    return this.userRepo.save(user)
  }

  async findUserByEmail(email: string) {
    return this.userRepo.findOne({
      where: { email },
      relations: { role: true },
    })
  }

  async findUserById(id: string) {
    return this.userRepo.findOne({
      where: { id },
    })
  }
}
