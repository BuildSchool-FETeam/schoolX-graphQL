import { BaseEntity } from 'src/common/entity/base.entity'
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { EvaluationComment } from './evaluationComment.entity'
import { GroupAssignment } from './groupAssignment.entity'

@Entity()
export class SubmittedAssignment extends BaseEntity {
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
