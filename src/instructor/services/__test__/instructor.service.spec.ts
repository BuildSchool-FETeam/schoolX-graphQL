import { NotFoundException } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { AdminUser } from 'src/adminUser/AdminUser.entity'
import { repositoryMockFactory } from 'src/common/mock/repositoryMock'
import { CacheService } from 'src/common/services/cache.service'
import { TokenService } from 'src/common/services/token.service'
import { Instructor } from 'src/instructor/entities/Instructor.entity'
import { Repository } from 'typeorm'
import { InstructorInput, InstructorService } from '../instructor.service'

const mockTokenService = {
  async getAdminUserByToken() {
    return Promise.resolve({})
  },
}

const mockCacheService = {}

function createInstructorInput(): InstructorInput {
  return {
    name: 'leesin',
    email: 'test@test.com',
    title: 'Mr',
    description: 'desc',
    imageUrl: 'img',
    filePath: 'filePath',
    phone: '001',
  }
}

describe('InstructorService', () => {
  let instructorService: InstructorService
  let instructorRepo: Repository<Instructor>

  beforeEach(async () => {
    let testModule = Test.createTestingModule({
      providers: [
        InstructorService,
        TokenService,
        CacheService,
        {
          provide: getRepositoryToken(Instructor),
          useFactory: repositoryMockFactory,
        },
      ],
    })

    testModule = testModule
      .overrideProvider(TokenService)
      .useValue(mockTokenService)
    testModule = testModule
      .overrideProvider(CacheService)
      .useValue(mockCacheService)

    const compiledModule = await testModule.compile()

    instructorService = compiledModule.get(InstructorService)
    instructorRepo = compiledModule.get(getRepositoryToken(Instructor))
  })

  describe('createInstructor', () => {
    it('should create instructor', async () => {
      const mockInstructorData: Instructor = {
        name: 'leesin',
        email: 'test@test.com',
        description: '',
        courses: [],
        imageUrl: '',
        filePath: '',
        phone: '',
        createdBy: new AdminUser(),
        id: '',
        title: 'Mr',
        createdAt: undefined,
        updatedAt: undefined,
      }

      const instructorInput = createInstructorInput()

      const spyCreate = jest
        .spyOn(instructorRepo, 'create')
        .mockReturnValue(mockInstructorData)
      const spySave = jest
        .spyOn(instructorRepo, 'save')
        .mockResolvedValue(mockInstructorData)

      const data = await instructorService.createInstructor(
        instructorInput,
        'Bear token'
      )

      expect(spyCreate).toHaveBeenCalledTimes(1)
      expect(spySave).toHaveBeenCalledTimes(1)
      expect(data).toEqual(mockInstructorData)
    })
  })

  describe('updateInstructor', () => {
    it('should throw error when cannot find a new instructor', async () => {
      const instructorInput = createInstructorInput()

      jest.spyOn(instructorService, 'findById').mockResolvedValue(undefined)

      try {
        await instructorService.updateInstructor('id', instructorInput)
      } catch (e) {
        expect(e).toEqual(new NotFoundException('Cannot found this instructor'))
      }
    })

    it('should update an instructor when found it with id', async () => {
      const instructorInput = createInstructorInput()

      const mockInstructorData: Instructor = {
        name: 'leesin1',
        email: 'test@test.com1',
        description: 'desc1',
        imageUrl: 'img1',
        filePath: 'filePath1',
        phone: '002',
        title: 'Mr1',
        courses: [],
        createdBy: new AdminUser(),
        id: '',
        createdAt: undefined,
        updatedAt: undefined,
      }

      jest
        .spyOn(instructorService, 'findById')
        .mockResolvedValue(mockInstructorData)
      jest
        .spyOn(instructorRepo, 'save')
        .mockImplementation(
          async (data) => Promise.resolve(data) as Promise<Instructor>
        )

      const data = await instructorService.updateInstructor(
        'id',
        instructorInput
      )

      expect(data).toEqual({ ...mockInstructorData, ...instructorInput })
    })
  })
})
