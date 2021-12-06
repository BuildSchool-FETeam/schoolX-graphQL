import { Assignment } from 'src/assignment/entities/Assignment.entity';
import { ClientUser } from 'src/clientUser/entities/ClientUser.entity';
import { BaseEntity } from 'src/common/entity/base.entity';
import { Course } from '../../courses/entities/Course.entity';
import { Lesson } from 'src/courses/entities/Lesson.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Article } from 'src/article/entities/Article.entity';
import { Student } from 'src/assignment/entities/fileAssignment/student.entity';

@Entity()
export class UserComment extends BaseEntity {
  @ManyToOne(() => ClientUser, (clientUser) => clientUser.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  createdBy: ClientUser;

  @Column()
  content: string;

  @Column('int2', { default: 0 })
  votes: number;

  @OneToMany(() => UserComment, (userComment) => userComment.replyTo)
  reply: UserComment[];

  @ManyToOne(() => Course, (course) => course.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  course: Course;

  @ManyToOne(() => Lesson, (lesson) => lesson.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  lesson: Lesson;

  @ManyToOne(() => Assignment, (assign) => assign.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  assignment: Assignment;

  @ManyToOne(() => Article, (article) => article.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  article: Article;

  @ManyToOne(() => UserComment, (userComment) => userComment.reply, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  replyTo: UserComment;

  @ManyToOne(() => Student, (submit) => submit.comments, {
    onDelete: "CASCADE"
  })
  @JoinColumn()
  student: Student
}
