import { CommentEvaluation } from 'src/assignment/entities/fileAssignment/commentEvaluation.entity';
import { BaseEntityWithCreatedBy } from 'src/common/entity/base.entity';
import { Role } from 'src/permission/entities/Role.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class AdminUser extends BaseEntityWithCreatedBy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @ManyToOne(() => Role, (role) => role.adminUsers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'role',
  })
  role: Role;

  @OneToMany(() => CommentEvaluation, (comment) => comment.createdBy)
  commentEvaluations: CommentEvaluation[]
}
