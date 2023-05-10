import { InternalServerErrorException } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { ClientUserService } from 'src/clientUser/services/clientUser.service'
import { assertThrowError } from 'src/common/mock/customAssertion'
import { CourseService } from 'src/courses/services/course.service'
import { LessonDocumentService } from 'src/courses/services/document.service'
import { CacheService } from '../cache.service'
import { CronService } from '../cron.service'
import { GCStorageService } from '../GCStorage.service'

const gcStorageService = {
  getAllFileNames: jest.fn(),
  deleteFile: jest.fn(),
}

const courseService = {
  findWithOptions: jest.fn().mockResolvedValue([{ filePath: 'file1' }]),
}
const lessonDocService = {
  findWithOptions: jest.fn().mockResolvedValue([{ filePath: 'file22' }]),
}
const cacheService = {
  setValue: jest.fn(),
}
const clientUserService = {
  findWithOptions: jest.fn().mockResolvedValue([{ filePath: 'file44' }]),
}

describe('CronService', () => {
  let service: CronService

  beforeAll(async () => {
    const testModule = Test.createTestingModule({
      providers: [
        CronService,
        GCStorageService,
        CourseService,
        LessonDocumentService,
        CacheService,
        ClientUserService,
      ],
    })

    testModule.overrideProvider(GCStorageService).useValue(gcStorageService)
    testModule.overrideProvider(CourseService).useValue(courseService)
    testModule
      .overrideProvider(LessonDocumentService)
      .useValue(lessonDocService)
    testModule.overrideProvider(CacheService).useValue(cacheService)
    testModule.overrideProvider(ClientUserService).useValue(clientUserService)

    const module = await testModule.compile()

    service = module.get(CronService)
  })

  describe('clearTrashFiles', () => {
    it('should throw error when cause some error', async () => {
      gcStorageService.getAllFileNames.mockImplementation(() => {
        throw new InternalServerErrorException('test err')
      })

      await assertThrowError(
        service.clearTrashFiles.bind(service),
        new InternalServerErrorException('test err')
      )
    })

    it('should clear all the relevant files', async () => {
      gcStorageService.getAllFileNames.mockResolvedValue([
        'file1',
        'file2',
        'file3',
        'file4',
      ])
      await service.clearTrashFiles()

      expect(gcStorageService.deleteFile).toBeCalledTimes(3)
    })
  })
})
