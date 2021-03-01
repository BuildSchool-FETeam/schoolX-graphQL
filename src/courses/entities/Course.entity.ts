import { BaseEntity } from "src/common/Entity/base.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { Lesson } from "./Lesson.entity";

@Entity()
export class Course extends BaseEntity {
  @Column()
  description: string

  @Column('int4')
  votes: number

  @Column()
  imageUrl: string

  @Column('int2')
  timeByHour: number

  @Column()
  instructorId: Instructor

  @Column()
  isCompleted: boolean

  @Column()
  benefits: string[]

  @Column()
  requirements: string[]

  @Column()
  joiningUser?: string[]

  @Column()
  comments: UserComment[]

  @Column('int2')
  levels: number

  @Column()
  tags: Tag[]

  @Column()
  @OneToMany(() => Lesson, lesson => lesson.course)
  lessons: Lesson[]
}