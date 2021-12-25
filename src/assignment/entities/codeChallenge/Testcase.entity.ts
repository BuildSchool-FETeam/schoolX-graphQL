import { BaseEntity } from 'src/common/entity/base.entity'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { CodeChallenge } from './CodeChallenge.entity'

export enum TestCaseProgrammingLanguage {
  javascript = 'javascript',
  python = 'python',
  CPlus = 'CPlus',
  java = 'java',
}

@Entity()
export class TestCase extends BaseEntity {
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
