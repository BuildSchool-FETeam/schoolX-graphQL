import { BaseEntityUUID } from 'src/common/entity/base.entity'
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { Assignment } from '../Assignment.entity'
import { Question } from './Question.entity'

@Entity()
export class Quiz extends BaseEntityUUID {
  @Column()
  description: string

  @Column('int4', { default: 10, nullable: true })
  score: number

  @ManyToOne(() => Assignment, (assignment) => assignment.quizs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  assignment: Assignment

  @OneToMany(() => Question, (question) => question.quiz)
  questions: Question[]

  @Column({ default: 0 })
  timeByMinute: number
}
