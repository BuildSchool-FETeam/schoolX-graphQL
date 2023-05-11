import { GCStorageService } from 'src/common/services/GCStorage.service'
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common'
import { Course } from 'src/courses/entities/Course.entity'
import * as _ from 'lodash'
import { LessonDocument } from 'src/courses/entities/LessonDocument.entity'
import { CourseService } from 'src/courses/services/course.service'
import { LessonDocumentService } from 'src/courses/services/document.service'
import { ClientUserService } from 'src/clientUser/services/clientUser.service'
import { ClientUser } from 'src/clientUser/entities/ClientUser.entity'
import { CacheService } from './cache.service'
import { cacheConstant } from '../constants/cache.contant'
// import { Timeout } from '@nestjs/schedule';

type ArrayPromises = [
  Promise<string[]>,
  Promise<Course[]>,
  Promise<LessonDocument[]>,
  Promise<ClientUser[]>
]

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name)

  constructor(
    private gcStorage: GCStorageService,
    private courseService: CourseService,
    private lessonDocumentService: LessonDocumentService,
    private cacheService: CacheService,
    private clientUserService: ClientUserService
  ) {}

  // @Timeout(2000)
  // @Cron('0 0 * * *') PRODUCTION ONLY
  async clearTrashFiles() {
    try {
      const promises: ArrayPromises = [
        this.gcStorage.getAllFileNames(),
        this.courseService.findWithOptions(),
        this.lessonDocumentService.findWithOptions(),
        this.clientUserService.findWithOptions(),
      ]
      this.logger.debug('[WARNING]: Running cleaning up')
      this.cacheService.setValue(cacheConstant.CLEAR_FILE, true)

      await Promise.all(promises).then((result) => {
        const [files, courses, lessonDocs, clientUser] = result
        const listFilePaths = [
          ..._.map(courses, 'filePath'),
          ..._.map(lessonDocs, 'filePath'),
          ..._.map(clientUser, 'filePath'),
        ]

        const trashFiles = _.difference(files, listFilePaths)

        trashFiles.forEach(async (filePath) =>
          this.gcStorage.deleteFile(filePath)
        )
        this.cacheService.setValue(cacheConstant.CLEAR_FILE, false)
      })
    } catch (err) {
      this.logger.error(err)
      throw new InternalServerErrorException(err)
    }
  }
}
