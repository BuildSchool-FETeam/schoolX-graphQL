import { Assignment } from 'src/assignment/entities/Assignment.entity';
import { ClientUser } from 'src/clientUser/entities/ClientUser.entity';
import { BaseEntity } from 'src/common/Entity/base.entity';
import { Course } from '../../courses/entities/Course.entity';
import { Lesson } from 'src/courses/entities/Lesson.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class UserComment extends BaseEntity {
  @ManyToOne(() => ClientUser, (clientUser) => clientUser.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  author: ClientUser;

  @Column()
  content: string;

  @Column('int2')
  votes: number;

  @OneToMany(() => UserComment, (userComment) => userComment.reply)
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
}
