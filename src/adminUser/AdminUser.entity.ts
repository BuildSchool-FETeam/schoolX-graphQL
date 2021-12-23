/* eslint-disable @typescript-eslint/no-unused-vars */
import { EvaluationComment } from 'src/assignment/entities/fileAssignment/evaluationComment.entity';
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
export class AdminUser {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column()
  email: string

  @Column()
  password: string

  @ManyToOne(() => Role, (role) => role.adminUsers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'role',
  })
  role: Role

  @OneToMany(() => EvaluationComment, (comment) => comment.createdBy)
  evaluationComments: EvaluationComment[]

  @ManyToOne(() => AdminUser, { onDelete: 'CASCADE' })
  createdBy: AdminUser
}
