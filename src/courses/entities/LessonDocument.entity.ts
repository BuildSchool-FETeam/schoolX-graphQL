import { BaseEntity } from 'src/common/entity/base.entity'
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { Lesson } from './Lesson.entity'

@Entity()
export class LessonDocument {

  @PrimaryGeneratedColumn()
  id: string

  @Column({ nullable: true })
  title: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
  
  @Column()
  url: string

  @Column()
  filePath: string

  @ManyToOne(() => Lesson, (lesson) => lesson.documents, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  lesson: Lesson
}
