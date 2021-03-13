import { GCStorageService } from 'src/common/services/GCStorage.service';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Course } from 'src/courses/entities/Course.entity';
import * as _ from 'lodash';
import { LessonDocument } from 'src/courses/entities/LessonDocument.entity';
import { CourseService } from 'src/courses/services/course.service';
import { LessonDocumentService } from 'src/courses/services/document.service';
import { Instructor } from 'src/instructor/entities/Instructor.entity';
import { InstructorService } from 'src/instructor/services/instructor.service';
import { CacheService } from './cache.service';
import { cacheConstant } from '../constants/cache.contant';
import { Timeout } from '@nestjs/schedule';

type ArrayPromises = [
  Promise<string[]>,
  Promise<Instructor[]>,
  Promise<Course[]>,
  Promise<LessonDocument[]>,
];

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(
    private gcStorage: GCStorageService,
    private instructorService: InstructorService,
    private courseService: CourseService,
    private lessonDocumentService: LessonDocumentService,
    private cacheService: CacheService,
  ) {}

  @Timeout(2000)
  // @Cron('0 0 * * *') PRODUCTION ONLY
  async clearTrashFiles() {
    try {
      const promises: ArrayPromises = [
        this.gcStorage.getAllFiles(),
        this.instructorService.findWithOptions(),
        this.courseService.findWithOptions(),
        this.lessonDocumentService.findWithOptions(),
      ];
      this.logger.debug('[WARNING]: Running cleaning up');
      this.cacheService.setValue(cacheConstant.CLEAR_FILE, true);

      Promise.all(promises).then((result) => {
        const [files, instructors, courses, lessonDocs] = result;
        const listFilePaths = [
          ..._.map(instructors, 'filePath'),
          ..._.map(courses, 'filePath'),
          ..._.map(lessonDocs, 'filePath'),
        ];

        const trashFiles = _.difference(files, listFilePaths);

        trashFiles.forEach((filePath) => this.gcStorage.deleteFile(filePath));
        this.cacheService.setValue(cacheConstant.CLEAR_FILE, false);
      });
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err);
    }
  }
}
