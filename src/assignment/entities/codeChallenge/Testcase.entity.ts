import { BaseEntity } from 'src/common/entity/base.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { CodeChallenge } from './CodeChallenge.entity'

export enum TestCaseProgrammingLanguage {
  javascript = 'javascript',
  python = 'python',
  CPlus = 'CPlus',
  java = 'java',
}

@Entity()
export class TestCase {
  @PrimaryGeneratedColumn()
  id: string

  @Column()
  title: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @Column()
  generatedExpectResultScript?: string

  @Column({ nullable: true })
  timeEvaluation?: number

  @Column()
  expectResult?: string

  @Column()
  runningTestScript: string

  @Column({ enum: TestCaseProgrammingLanguage })
  programingLanguage: string

  @ManyToOne(() => CodeChallenge, (assign) => assign.testCases, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  codeChallenge: CodeChallenge
}
