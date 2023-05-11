import { AdminUser } from 'src/adminUser/AdminUser.entity'
import { ClientUser } from 'src/clientUser/entities/ClientUser.entity'

import { UserComment } from 'src/comment/entities/UserComment.entity'
import { Tag } from 'src/tag/entities/tag.entity'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Lesson } from './Lesson.entity'

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: string

  @Column({ nullable: true })
  title: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @Column()
  description: string

  @Column({ nullable: true, type: 'int' })
  votes: number

  @Column({ nullable: true })
  imageUrl: string

  @Column({ nullable: true })
  filePath: string

  @Column({ nullable: true, type: 'int2' })
  timeByHour: number

  @OneToMany(() => Lesson, (lesson) => lesson.course)
  lessons: Lesson[]

  @Column({ nullable: true })
  isCompleted: boolean

  @Column()
  benefits: string

  @Column()
  requirements: string

  @ManyToMany(() => ClientUser)
  @JoinTable()
  joinedUsers?: ClientUser[]

  @ManyToMany(() => ClientUser)
  @JoinTable()
  completedUser?: ClientUser[]

  @ManyToMany(() => Tag, (tag) => tag.courses)
  tags: Tag[]

  @Column({ nullable: true, default: 'Beginner' })
  levels: string

  @OneToMany(() => UserComment, (userComment) => userComment.course)
  comments: UserComment[]

  @ManyToOne(() => AdminUser || ClientUser, { onDelete: 'CASCADE' })
  createdBy: ClientUser | AdminUser
}
