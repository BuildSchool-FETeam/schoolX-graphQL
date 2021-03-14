import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Assignment } from 'src/Assignment/entities/Assignment.entity';
import { AssignmentService } from 'src/assignment/services/assignment.service';

@Resolver('AssignmentType')
export class AssignmentTypeResolver {
  constructor(private assignmentService: AssignmentService) {}

  @ResolveField()
  async lesson(@Parent() parent: Assignment) {
    const assignment = await this.assignmentService.findById(parent.id, {
      relations: ['lesson'],
    });

    return assignment.lesson;
  }

  @ResolveField()
  async testCases(@Parent() parent: Assignment) {
    const assignment = await this.assignmentService.findById(parent.id, {
      relations: ['testCases'],
    });

    return assignment.testCases;
  }

  @ResolveField()
  async languageSupport(@Parent() parent: Assignment) {
    return parent.languageSupport.split('|');
  }

  @ResolveField()
  async hints(@Parent() parent: Assignment) {
    return parent.hints.split('|');
  }
}
