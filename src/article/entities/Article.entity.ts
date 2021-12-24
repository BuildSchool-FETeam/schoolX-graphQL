import { ClientUser } from 'src/clientUser/entities/ClientUser.entity';
import { UserComment } from 'src/comment/entities/UserComment.entity';
import { BaseEntity } from 'src/common/entity/base.entity'
import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from 'typeorm'
import { ArticleTag } from './ArticleTag.entity'

enum ArticleStatus {
  pending = 'pending',
  reject = 'reject',
  accept = 'accept',
}
@Entity()
export class Article extends BaseEntity {
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
