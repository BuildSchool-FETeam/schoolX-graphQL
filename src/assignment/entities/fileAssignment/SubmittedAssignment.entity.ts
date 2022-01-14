import { BaseEntity } from 'src/common/entity/base.entity'
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { EvaluationComment } from './evaluationComment.entity'
import { GroupAssignment } from './groupAssignment.entity'

@Entity()
export class SubmittedAssignment {
  @PrimaryGeneratedColumn()
  id: string

  @Column({ nullable: true })
  title: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
  
  @Column({ nullable: true })
  description: string

  @Column()
  order: number

  @Column({ nullable: true })
  fileUrl: string

  @Column({ nullable: true })
  reApply?: boolean

  @OneToMany(() => EvaluationComment, (comment) => comment.submitted)
  comments: EvaluationComment[]

  @ManyToOne(() => GroupAssignment, (group) => group.submitteds, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  group: GroupAssignment

  @Column({ default: false })
  hasSeen: boolean
}
