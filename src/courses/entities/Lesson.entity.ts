import { Assignment } from 'src/Assignment/entities/Assignment.entity';
import { UserComment } from 'src/comment/entities/UserComment.entity';
import { BaseEntity } from 'src/common/Entity/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Course } from './Course.entity';
import { LessonDocument } from './LessonDocument.entity';

@Entity()
export class Lesson extends BaseEntity {
  @Column()
  videoUrl: string;

  @Column()
  votes: string;

  @ManyToOne(() => Course, (course) => course.lessons, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  course: Course;

  @OneToMany(() => UserComment, (cmt) => cmt.lesson)
  comments: UserComment[];

  @Column('varchar')
  content: string;

  @OneToMany(() => Assignment, (assign) => assign.lesson)
  assignments: Assignment[];

  @OneToMany(() => LessonDocument, (doc) => doc.lesson)
  documents: LessonDocument[];
}
