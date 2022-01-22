import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Quiz } from './Quiz.entity'

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: string

  @Column({ nullable: true })
  title: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @Column({ nullable: true })
  order: number

  @ManyToOne(() => Quiz, (quiz) => quiz.questions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  quiz: Quiz

  @Column('text', { array: true, nullable: true })
  options: string[]

  @Column({ nullable: true })
  isMultiple: boolean

  @Column({ nullable: true })
  result?: number

  @Column('int', {
    nullable: true,
    array: true,
  })
  results?: number[]
}
