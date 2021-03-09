import { LessonService } from './lesson.service';
import { Repository } from 'typeorm';
import { BaseService } from 'src/common/services/base.service';
import { LessonDocument } from './../entities/LessonDocument.entity';
import { InjectRepository } from '@nestjs/typeorm';

export class LessonDocumentService extends BaseService<LessonDocument> {
  constructor(
    @InjectRepository(LessonDocument)
    private docRepo: Repository<LessonDocument>,
    private lessonService: LessonService
  ) {
    super(docRepo, 'Document')
  }

  async addDocumentToLesson (lessonId: string, data: { title: string, url: string, filePath: string }) {
    const doc = this.docRepo.create({
      title: data.title,
      url: data.url,
      filePath: data.filePath
    })
    const lesson = await this.lessonService.findById(lessonId);

    doc.lesson = lesson;

    return this.docRepo.save(doc);
  }

  removeDocFromLesson (docId: string) {
    return this.docRepo.delete(docId);
  }
}