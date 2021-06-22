import { Article } from 'src/article/entities/Article.entity';
import { UserComment } from 'src/comment/entities/UserComment.entity';
import { UserBaseEntityUUID } from 'src/common/entity/base.entity';
import { Instructor } from 'src/instructor/entities/Instructor.entity';
import { Role } from 'src/permission/entities/Role.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Achievement } from './Achivement.entity';

// FOR testing purpose
@Entity()
export class ClientUser extends UserBaseEntityUUID {
  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  githubUrl: string;

  @Column({ nullable: true })
  dayOfBirth: string;

  @Column({ nullable: true })
  homeTown: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  filePath: string;

  @Column({ nullable: true, default: 0 })
  isActive: 0 | 1;

  @Column({ nullable: true })
  activationCode: string;

  @Column({ nullable: true, type: 'bigint' })
  activationCodeExpire: number;

  @OneToMany(() => UserComment, (cmt) => cmt.author)
  comments: UserComment[];

  @OneToOne(() => Instructor, (instructor) => instructor.user)
  @JoinColumn()
  instructor: Instructor;

  @OneToOne(() => Achievement, (ach) => ach.clientUser)
  achievement: Achievement;

  @ManyToOne(() => Role)
  role: Role;

  @OneToMany(() => Article, (article) => article.createdBy)
  articles: Article[];
}
