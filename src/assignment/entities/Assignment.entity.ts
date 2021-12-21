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
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CodeChallenge } from './codeChallenge/CodeChallenge.entity';
import { FileAssignment } from './fileAssignment/fileAssignment.entity';
import { Quiz } from './quiz/Quiz.entity';

@Entity()
export class Assignment {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => Lesson, (lesson) => lesson, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  lesson: Lesson;

  @OneToMany(() => UserComment, (cmt) => cmt.assignment)
  comments: UserComment[];

  @OneToMany(() => Quiz, (quiz) => quiz.assignment)
  quizs: Quiz[];

  @OneToMany(() => CodeChallenge, (codeChalenge) => codeChalenge.assignment)
  codeChallenges: CodeChallenge[];

  @OneToMany(
    () => FileAssignment,
    (fileAssignment) => fileAssignment.assignment,
  )
  fileAssignments: FileAssignment[];

  @ManyToMany(() => ClientUser)
  @JoinTable()
  usersComplete: ClientUser[];
}
