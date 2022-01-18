import { Assignment } from 'src/assignment/entities/Assignment.entity'
import { ClientUser } from 'src/clientUser/entities/ClientUser.entity'
import { BaseEntity } from 'src/common/entity/base.entity'
import { Lesson } from 'src/courses/entities/Lesson.entity'
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { Article } from 'src/article/entities/Article.entity'
import { SubmittedAssignment } from 'src/assignment/entities/fileAssignment/SubmittedAssignment.entity'
import { Course } from '../../courses/entities/Course.entity'

@Entity()
export class UserComment{
  @PrimaryGeneratedColumn()
  id: string

  @Column({ nullable: true })
  title: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
  
  @ManyToOne(() => ClientUser, (clientUser) => clientUser.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  createdBy: ClientUser

  @Column()
  content: string

  @Column('int2', { default: 0 })
  votes: number

  @OneToMany(() => UserComment, (userComment) => userComment.replyTo)
  reply: UserComment[]

  @ManyToOne(() => Course, (course) => course.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  course: Course

  @ManyToOne(() => Lesson, (lesson) => lesson.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  lesson: Lesson

  @ManyToOne(() => Assignment, (assign) => assign.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  assignment: Assignment

  @ManyToOne(() => Article, (article) => article.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  article: Article

  @ManyToOne(() => UserComment, (userComment) => userComment.reply, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  replyTo: UserComment

  @ManyToOne(
    () => SubmittedAssignment,
    (submittedAssignment) => submittedAssignment.comments,
    {
      onDelete: 'CASCADE',
    }
  )
  @JoinColumn()
  submittedAssignment: SubmittedAssignment
}
