import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Article } from './Article.entity'

@Entity()
export class ArticleTag {
  @PrimaryGeneratedColumn()
  id: string

  @Column({ nullable: true })
  title: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToMany(() => Article, (art) => art.tags)
  @JoinTable()
  articles: Article[]
}
