import { Assignment } from 'src/assignment/entities/Assignment.entity'
import { UserComment } from 'src/comment/entities/UserComment.entity'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Course } from './Course.entity'
import { LessonDocument } from './LessonDocument.entity'

@Entity()
export class Lesson {
  @PrimaryGeneratedColumn()
  id: string

  @Column({ nullable: true })
  title: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

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
