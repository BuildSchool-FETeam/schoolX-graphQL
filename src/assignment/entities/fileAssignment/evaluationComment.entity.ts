import { AdminUser } from 'src/adminUser/AdminUser.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SubmittedAssignment } from './SubmittedAssignment.entity';

@Entity()
export class EvaluationComment {
  @PrimaryGeneratedColumn()
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;

  @Column()
  content: string;

  @ManyToOne(() => AdminUser, (adminUser) => adminUser.evaluationComments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  createdBy: AdminUser;

  @ManyToOne(
    () => SubmittedAssignment,
    (submittedAssignment) => submittedAssignment.comments,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn()
  submitted: SubmittedAssignment;
}
