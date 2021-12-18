/* eslint-disable @typescript-eslint/no-unused-vars */
<<<<<<< HEAD
=======
import { EvaluationComment } from 'src/assignment/entities/fileAssignment/evaluationComment.entity';
>>>>>>> 8383a0d (resolve)
import { BaseEntityWithCreatedBy } from 'src/common/entity/base.entity';
import { Role } from 'src/permission/entities/Role.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
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
<<<<<<< HEAD
=======

  @OneToMany(() => EvaluationComment, (comment) => comment.createdBy)
  evaluationComments: EvaluationComment[]
>>>>>>> 8383a0d (resolve)
}
