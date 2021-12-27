import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Injectable, NotFoundException } from '@nestjs/common'
import { BaseService } from 'src/common/services/base.service'
import * as _ from 'lodash'
import { TokenService } from 'src/common/services/token.service'
import { CacheService } from 'src/common/services/cache.service'
import { Instructor } from '../entities/Instructor.entity'

export interface InstructorInput {
  name: string
  email: string
  title: string
  description: string
  imageUrl: string
  filePath: string
  phone: string
  clientUserId?: string
}

@Injectable()
export class InstructorService extends BaseService<Instructor> {
  constructor(
    @InjectRepository(Instructor)
    private instructorRepo: Repository<Instructor>,
    private tokenService: TokenService,
    public cachingService: CacheService
  ) {
    super(instructorRepo, 'Instructor', cachingService)
  }

  async createInstructor(data: InstructorInput, token: string) {
    const adminUser = await this.tokenService.getAdminUserByToken(token)
    const instructor = this.instructorRepo.create({
      ...data,
      createdBy: adminUser,
    })

    return this.instructorRepo.save(instructor)
  }

  async updateInstructor(id: string, data: InstructorInput) {
    const inst = await this.findById(id, {})

    if (!inst) {
      throw new NotFoundException('Cannot found this instructor')
    }

    _.forOwn(data, (value, key: keyof InstructorInput) => {
      value && (inst[key] = value)
    })

    return this.instructorRepo.save(inst)
  }
}
