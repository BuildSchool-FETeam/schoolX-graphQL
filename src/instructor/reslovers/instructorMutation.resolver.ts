import { InstructorSetInput, InstructorType } from './../../graphql';
import { InstructorService } from './../services/instructor.service';
import { Args, Mutation, ResolveField, Resolver } from "@nestjs/graphql";

@Resolver('InstructorMutation')
export class InstructorMutationResolver {
  constructor(
    private instructorService: InstructorService
  ) { }

  @Mutation()
  instructorMutation () {
    return {}
  }

  @ResolveField()
  setInstructor (@Args('data') data: InstructorSetInput): Promise<InstructorType> | void {
    console.log(data.image);
  }
}