import { UserComment } from 'src/comment/entities/UserComment.entity';
import { BaseEntity } from 'src/common/Entity/base.entity';
import { Lesson } from 'src/courses/entities/Lesson.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { TestCase } from './Testcase.entity';

@Entity()
export class Assignment extends BaseEntity {
  @ManyToOne(() => Lesson, (lesson) => lesson, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  lesson: Lesson;

  @OneToMany(() => UserComment, (cmt) => cmt.assignment)
  comments: UserComment[];

  @Column()
  description: string;

  @Column()
  hints: string;

  @Column('int4', {default: 10, nullable: true})
  score: number;

  @Column()
  input: string;

  @Column()
  output: string;

  @Column()
  languageSupport: string;

  @OneToMany(() => TestCase, (testCase) => testCase.assignment)
  testCases: TestCase[]
}
