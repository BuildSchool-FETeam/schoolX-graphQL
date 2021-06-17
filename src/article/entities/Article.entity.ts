import { ClientUser } from 'src/clientUser/entities/ClientUser.entity';
import { UserComment } from 'src/comment/entities/UserComment.entity';
import { BaseEntity } from 'src/common/entity/base.entity';
import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { ArticleTag } from './ArticleTag.entity';

enum ArticleStatus {
  pending = 'pending',
  reject = 'reject',
  accept = 'accept',
}
@Entity()
export class Article extends BaseEntity {
  @Column()
  shortDescription: string;

  @Column()
  content: string;

  @Column({ default: 0 })
  votes: number;

  @Column({ enum: ['reject', 'pending', 'accept'], default: 'pending'})
  status: ArticleStatus;

  @ManyToOne(() => ClientUser, (clientUser) => clientUser.articles)
  author: ClientUser;

  @OneToMany(() => UserComment, (userComment) => userComment.article)
  comments: UserComment[];

  @Column({ default: 0 })
  views: number;

  @Column({ default: 0 })
  shares: number;

  @ManyToMany(() => ArticleTag, (at) => at.articles)
  tags: ArticleTag[];
}
