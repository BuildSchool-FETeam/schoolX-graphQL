import { ClientUser } from 'src/clientUser/entities/ClientUser.entity';
import { UserComment } from 'src/comment/entities/UserComment.entity';
import { BaseEntity } from 'src/common/entity/base.entity';
import { Lesson } from 'src/courses/entities/Lesson.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { CodeChallenge } from './CodeChallenge.entity';
import { Quiz } from './Quiz.entity';

@Entity()
export class Assignment extends BaseEntity {
  @ManyToOne(() => Lesson, (lesson) => lesson, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  lesson: Lesson;

  @OneToMany(() => UserComment, (cmt) => cmt.assignment)
  comments: UserComment[];

  @OneToMany(() => Quiz, quiz => quiz.assignment)
  quizs: Quiz[];

  @OneToMany(() => CodeChallenge, codeChalenge => codeChalenge.assignment)
  codeChallenges: CodeChallenge[]

  @ManyToMany(() => ClientUser)
  @JoinTable()
  usersComplete: ClientUser[];
}