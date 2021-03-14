import { BaseEntity } from 'src/common/Entity/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Assignment } from './Assignment.entity';

@Entity()
export class TestCase extends BaseEntity {
  @Column()
  expectedOutput: string;

  @Column()
  input: string;

  @ManyToOne(() => Assignment, (assign) => assign.testCases, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  assignment: Assignment;
}
