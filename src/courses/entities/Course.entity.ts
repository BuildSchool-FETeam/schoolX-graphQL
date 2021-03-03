import { UserComment } from 'src/comment/entities/userComment.entity';
import { BaseEntity } from 'src/common/Entity/base.entity';
import { Instructor } from 'src/instructor/entities/Instructor.entity';
import { Tag } from 'src/tag/entities/tag.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Lesson } from './Lesson.entity';

@Entity()
export class Course extends BaseEntity {
  @Column()
  description: string;

  @Column('int4')
  votes: number;

  @Column()
  imageUrl: string;

  @Column('int2')
  timeByHour: number;

  @ManyToOne(() => Instructor, (instructor) => instructor.courses)
  @JoinColumn()
  instructor: Instructor;

  @Column()
  isCompleted: boolean;

  @Column()
  benefits: string[];

  @Column()
  requirements: string[];

  @Column()
  joiningUser?: string[];

  @OneToMany(() => UserComment, (cmt) => cmt.course)
  comments: UserComment[];

  @Column('int2')
  levels: number;

  @OneToMany(() => Tag, (tag) => tag.course)
  tags: Tag[];

  @OneToMany(() => Lesson, (lesson) => lesson.course)
  lessons: Lesson[];
}
