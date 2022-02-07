import { ClientUser } from 'src/clientUser/entities/ClientUser.entity'
import { UserComment } from 'src/comment/entities/UserComment.entity'
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { ArticleTag } from './ArticleTag.entity'

export enum ArticleStatus {
  pending = 'pending',
  reject = 'reject',
  accept = 'accept',
}
@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: string

  @Column({ nullable: true })
  title: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @Column()
  shortDescription: string

  @Column()
  content: string

  @Column({ default: 0, nullable: true })
  votes: number

  @Column({
    enum: ['reject', 'pending', 'accept'],
    default: 'pending',
    nullable: true,
  })
  status: ArticleStatus

  @ManyToOne(() => ClientUser, (clientUser) => clientUser.articles)
  createdBy: ClientUser

  @OneToMany(() => UserComment, (userComment) => userComment.article)
  comments: UserComment[]

  @Column({ default: 0, nullable: true })
  views: number

  @Column({ default: 0, nullable: true })
  shares: number

  @Column({ nullable: true })
  reviewComment: string

  @ManyToMany(() => ArticleTag, (at) => at.articles)
  tags: ArticleTag[]
}
