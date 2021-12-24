import { Assignment } from 'src/assignment/entities/Assignment.entity';
import { UserComment } from 'src/comment/entities/UserComment.entity';
import { BaseEntity } from 'src/common/entity/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm'
import { Course } from './Course.entity'
import { LessonDocument } from './LessonDocument.entity'

@Entity()
export class Lesson extends BaseEntity {
  @Column()
  videoUrl: string

  @Column({ nullable: true, default: 0 })
  votes: number

  @ManyToOne(() => Course, (course) => course.lessons, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  course: Course

  @Column('varchar')
  content: string

  @OneToMany(() => UserComment, (cmt) => cmt.lesson)
  comments: UserComment[]

  @OneToOne(() => Assignment, (assign) => assign.lesson)
  assignment: Assignment

  @OneToMany(() => LessonDocument, (doc) => doc.lesson)
  documents: LessonDocument[]
}
