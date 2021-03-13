import { ClientUser } from 'src/ClientUser/entities/ClientUser.entity';
import { BaseEntity } from 'src/common/Entity/base.entity';
import { Course } from 'src/courses/entities/Course.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

@Entity()
export class Instructor extends BaseEntity {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  description: string;

  @OneToOne(() => ClientUser, (clientUser) => clientUser.instructor)
  @JoinColumn()
  user?: ClientUser;

  @OneToMany(() => Course, (course) => course.instructor)
  courses: Course[];

  @Column()
  imageUrl: string;

  @Column()
  filePath: string;

  @Column()
  phone: string;
}
