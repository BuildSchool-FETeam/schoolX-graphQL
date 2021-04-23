import { UserComment } from 'src/comment/entities/UserComment.entity';
import { BaseEntityUUID } from 'src/common/Entity/base.entity';
import { Course } from 'src/courses/entities/Course.entity';
import { Instructor } from 'src/instructor/entities/Instructor.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
} from 'typeorm';

// FOR testing purpose
@Entity()
export class ClientUser extends BaseEntityUUID {
  @Column()
  email: string;

  @Column()
  imageUrl: string;

  @Column()
  filePath: string;

  @OneToMany(() => UserComment, (cmt) => cmt.author)
  comments: UserComment[];

  @OneToOne(() => Instructor, (instructor) => instructor.user)
  @JoinColumn()
  instructor: Instructor;

  @ManyToMany(() => Course, (course) => course.joiningUsers)
  courses: Course[]
}
