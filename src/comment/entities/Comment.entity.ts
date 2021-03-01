import { BaseEntity } from "src/common/Entity/base.entity";
import { Column, OneToMany } from "typeorm";

export class UserComment extends BaseEntity {
  @Column()
  author: ClientUser

  @Column()
  content: string

  @Column('int2')
  votes: number

  @Column()
  @OneToMany(() => UserComment, userComment => userComment.reply)
  reply: UserComment[]
}