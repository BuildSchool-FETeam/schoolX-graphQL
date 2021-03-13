import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { CourseType, InstructorType } from 'src/graphql';
import { InstructorService } from '../services/instructor.service';
import * as _ from 'lodash';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guard';

@UseGuards(AuthGuard)
@Resolver('InstructorType')
export class InstructorTypeResolver {
  constructor(private instructorService: InstructorService) {}

  @ResolveField()
  async courses(@Parent() instructor: InstructorType): Promise<CourseType[]> {
    const instructorWithCourses = await this.instructorService.findById(
      instructor.id,
      { relations: ['courses'] },
    );

    return _.map(instructorWithCourses.courses, (item) => {
      return {
        ...item,
        benefits: item.benefits.split('|'),
        requirements: item.requirements.split('|'),
      };
    }) as any;
  }
}
