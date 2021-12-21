import { Repository } from 'typeorm';
import { BaseService } from 'src/common/services/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { GCStorageService } from 'src/common/services/GCStorage.service';
import { LessonDocument } from '../entities/LessonDocument.entity';
import { Lesson } from '../entities/Lesson.entity';

export class LessonDocumentService extends BaseService<LessonDocument> {
  constructor(
    @InjectRepository(LessonDocument)
    private docRepo: Repository<LessonDocument>,
    private storageService: GCStorageService,
  ) {
    super(docRepo, 'Document');
  }

  async addDocumentToLesson(
    lesson: Lesson,
    data: { title: string; url: string; filePath: string },
  ) {
    const doc = this.docRepo.create({
      title: data.title,
      url: data.url,
      filePath: data.filePath,
    });

    doc.lesson = lesson;

    return this.docRepo.save(doc);
  }

  async removeDocFromLesson(docId: string) {
    const doc = await this.findById(docId);

    this.storageService.deleteFile(doc.filePath);
    return this.docRepo.delete(docId);
  }
}
