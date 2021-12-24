import { BaseEntity } from 'src/common/entity/base.entity';
import { Course } from 'src/courses/entities/Course.entity';
import { Entity, JoinTable, ManyToMany } from 'typeorm'

@Entity()
export class Tag extends BaseEntity {
  @ManyToMany(() => Course, (course) => course.tags)
  @JoinTable()
  courses: Course[]
}
