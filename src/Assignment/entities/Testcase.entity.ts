import { BaseEntity } from 'src/common/Entity/base.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Assignment } from './Assignment.entity';

@Entity()
export class TestCase extends BaseEntity {
  @Column()
  expectedOutput: string;

  @Column()
  input: string;

  @OneToOne(() => Assignment, (assign) => assign.testCase, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  assignment: Assignment;
}
