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

  @Column({ nullable: true, default: 0 })
  votes: number;

  @ManyToOne(() => Course, (course) => course.lessons, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  course: Course;

  @Column('varchar')
  content: string;

  @OneToMany(() => UserComment, (cmt) => cmt.lesson)
  comments: UserComment[];

  @OneToMany(() => Assignment, (assign) => assign.lesson)
  assignments: Assignment[];

  @OneToMany(() => LessonDocument, (doc) => doc.lesson)
  documents: LessonDocument[];
}
