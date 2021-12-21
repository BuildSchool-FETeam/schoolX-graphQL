import { UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  Mutation,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { TokenService } from 'src/common/services/token.service';
import {
  UpdateFollow,
  ClientUserUpdateInput,
  UpdateJoinedCourse,
  UpdateScore,
  Upload,
} from 'src/graphql';
import { ClientUserService } from '../services/clientUser.service';

@UseGuards(AuthGuard)
@Resolver('ClientUserMutation')
export class ClientUserMutationResolver {
  constructor(private clientUserService: ClientUserService) {}

  @Mutation()
  clientUserMutation() {
    return {};
  }

  @ResolveField()
  async updateClientUser(
    @Args('data') data: ClientUserUpdateInput,
    @Args('id') id: string,
  ) {
    return this.clientUserService.updateClientUserInfo(data, id);
  }

  @ResolveField()
  async updateClientUserAvatar(
    @Args('id') id: string,
    @Args('image') image: Upload,
  ) {
    return this.clientUserService.updateUserAvatar(id, image);
  }

  @ResolveField()
  async updateScore(
    @Args('data') data: UpdateScore,
    @Context() { req }: DynamicObject,
  ) {
    const id = this.clientUserService.getIdUserByHeaders(req.headers);

    await this.clientUserService.updateScore(id, data);

    return true;
  }

  @ResolveField()
  async updateJoinedCourse(
    @Args('data') data: UpdateJoinedCourse,
    @Context() { req }: DynamicObject,
  ) {
    const id = this.clientUserService.getIdUserByHeaders(req.headers);

    return this.clientUserService.updateJoinedCourse(id, data);
  }

  @ResolveField()
  async updateFollow(
    @Args('data') data: UpdateFollow,
    @Context() { req }: DynamicObject,
  ) {
    const id = this.clientUserService.getIdUserByHeaders(req.headers);

    if (id === data.idFollow) return false;

    return this.clientUserService.updateFollow(id, data);
  }

  @ResolveField()
  async updateCompletedCourses(
    @Args('idCourse') idCourse: string,
    @Context() { req }: DynamicObject,
  ) {
    const id = this.clientUserService.getIdUserByHeaders(req.headers);

    return this.clientUserService.updateCompletedCourses(id, idCourse);
  }
}
