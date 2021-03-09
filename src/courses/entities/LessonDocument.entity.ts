import { BaseEntity } from 'src/common/Entity/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Lesson } from './Lesson.entity';

@Entity()
export class LessonDocument extends BaseEntity {
  @Column()
  url: string;

  @Column()
  filePath: string;

  @ManyToOne(() => Lesson, (lesson) => lesson.documents, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @JoinColumn()
  lesson: Lesson;
}
