import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Assignment } from '../Assignment.entity'
import { TestCase } from './Testcase.entity'

@Entity()
export class CodeChallenge {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  title: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @Column()
  description: string

  @Column()
  hints: string

  @Column('int4', { default: 10, nullable: true })
  score: number

  @ManyToOne(() => Assignment, (assignment) => assignment.codeChallenges, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  assignment: Assignment

  @Column()
  input: string

  @Column()
  output: string

  @Column()
  languageSupport: string

  @OneToMany(() => TestCase, (testCase) => testCase.codeChallenge)
  testCases: TestCase[]
}
