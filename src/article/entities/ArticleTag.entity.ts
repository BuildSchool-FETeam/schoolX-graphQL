import { BaseEntity } from 'src/common/entity/base.entity'
import { Entity, JoinTable, ManyToMany } from 'typeorm'
import { Article } from './Article.entity'

@Entity()
export class ArticleTag extends BaseEntity {
  @ManyToMany(() => Article, (art) => art.tags)
  @JoinTable()
  articles: Article[]
}
