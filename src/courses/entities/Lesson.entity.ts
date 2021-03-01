import { BaseEntity, Column, Entity, ManyToOne } from 'typeorm';
import { Course } from './Course.entity';

Entity()
export class Lesson extends BaseEntity {
  @Column()
  videoUrl: string

  @Column()
  votes: string

  @Column()
  @ManyToOne(() => Course, course => course.lessons, {
    onDelete: 'CASCADE'
  })
  course: Course

  @Column()
  comments: UserComment[]

  @Column('varchar')
  content: string

  @Column()
  assignments: Assignment[]

  @Column()
  documents: LessonDocument[]
}