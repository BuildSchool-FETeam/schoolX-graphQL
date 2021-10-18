import { Assignment } from 'src/assignment/entities/Assignment.entity';
import { Course } from 'src/courses/entities/Course.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ClientUser } from './ClientUser.entity';

@Entity()
export class Achievement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => ClientUser, (clientUser) => clientUser.achievement, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  clientUser: ClientUser;

  @Column()
  rank: number;

  @ManyToMany(() => Course)
  @JoinTable()
  joinedCourse: Course[];

  @ManyToMany(() => ClientUser)
  @JoinTable()
  follow: ClientUser[];

  @ManyToMany(() => ClientUser)
  @JoinTable()
  followedBy: ClientUser[];

  @Column()
  score: number;

  @ManyToMany(() => Course, (course) => course.completedUser)
  @JoinTable()
  completedCourses: Course[];

  @ManyToMany(() => Assignment, (assign) => assign.usersComplete)
  @JoinTable()
  completedAssignment: Assignment[];
}
