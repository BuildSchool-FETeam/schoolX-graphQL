import { BaseEntity } from 'src/common/entity/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Assignment } from './Assignment.entity';

export enum TestCaseProgrammingLanguage {
  javascript = 'javascript',
  python = 'python',
  CSharp = 'CSharp',
  java = 'java',
}

@Entity()
export class TestCase extends BaseEntity {
  @Column()
  generatedExpectResultScript?: string;

  @Column({ nullable: true })
  timeEvaluation?: number;

  @Column()
  expectResult?: string;

  @Column()
  runningTestScript: string;

  @Column({ enum: TestCaseProgrammingLanguage })
  programingLanguage: string;

  @ManyToOne(() => Assignment, (assign) => assign.testCases, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  assignment: Assignment;
}
