import { BaseEntityUUID } from 'src/common/entity/base.entity'
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
import { GroupAssignment } from './groupAssignment.entity'

@Entity()
export class FileAssignment {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  title: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @Column({ nullable: true })
  description: string

  @Column()
  maxScore: number

  @Column()
  estimateTimeInMinute: number

  @Column({ nullable: true })
  contentInstruct: string

  @Column({ nullable: true })
  videoInstruct: string

  @Column({ nullable: true })
  explainContent: string

  @Column({ nullable: true })
  explainVideo: string

  @ManyToOne(
    () => Assignment,
    (fileAssignment) => fileAssignment.fileAssignments,
    {
      onDelete: 'CASCADE',
    }
  )
  @JoinColumn()
  assignment: Assignment

  @OneToMany(() => GroupAssignment, (group) => group.fileAssignment)
  submittedGroupAssignments: GroupAssignment[]
}
