import { BaseEntity } from 'src/common/Entity/base.entity';
import { Course } from 'src/courses/entities/Course.entity';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Tag extends BaseEntity {
  @ManyToOne(() => Course, (course) => course.tags)
  @JoinColumn()
  course: Course;
}
