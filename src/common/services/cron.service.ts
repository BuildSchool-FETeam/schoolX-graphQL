
import { GCStorageService } from 'src/common/services/GCStorage.service';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Timeout } from '@nestjs/schedule';
import { Course } from 'src/courses/entities/Course.entity';
import * as _ from 'lodash';
import { LessonDocument } from 'src/courses/entities/LessonDocument.entity';
import { CourseService } from 'src/courses/services/course.service';
import { LessonDocumentService } from 'src/courses/services/document.service';
import { Instructor } from 'src/instructor/entities/Instructor.entity';
import { InstructorService } from 'src/instructor/services/instructor.service';

type ArrayPromises = [
  Promise<string[]>, 
  Promise<Instructor[]>, 
  Promise<Course[]>, 
  Promise<LessonDocument[]>
]

@Injectable()
export class CronService {
  constructor(
    private gcStorage: GCStorageService,
    private instructorService: InstructorService,
    private courseService: CourseService,
    private lessonDocumentService: LessonDocumentService
  ) { }

  @Timeout(2000)
  async clearTrashFiles () {
    try {
      const promises: ArrayPromises = [
        this.gcStorage.getAllFiles(),
        this.instructorService.findWithOptions(),
        this.courseService.findWithOptions(),
        this.lessonDocumentService.findWithOptions(),
      ]

      Promise.all(promises)
        .then(result => {
          const [files, instructors, courses, lessonDocs] = result;
          const listFilePaths = [
            ..._.map(instructors, 'filePath'),
            ..._.map(courses, 'filePath'),
            ..._.map(lessonDocs, 'filePath')
          ]

          const trashFiles = _.differenceBy(files, listFilePaths);
          
          trashFiles.forEach(filePath => this.gcStorage.deleteFile(filePath));
        })

    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err)
    }
  }
}