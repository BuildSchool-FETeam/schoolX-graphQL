import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, ResolveField, Resolver } from '@nestjs/graphql';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { TokenService } from 'src/common/services/token.service';
import { ClientUserUpdateFollow, ClientUserUpdateInput, ClientUserUpdateJoinedCourse, ClientUserUpdateRank, ClientUserUpdateScore, Upload } from 'src/graphql';
import { ClientUser } from '../entities/ClientUser.entity';
import { ClientUserService } from '../services/clientUser.service';

@UseGuards(AuthGuard)
@Resolver('ClientUserMutation')
export class ClientUserMutationResolver {
  constructor(
    private clientUserService: ClientUserService,
  ) {}

  @Mutation()
  clientUserMutation() {
    return {};
  }

  @ResolveField()
  updateClientUser(
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
  async updateRank(
    @Args('data') data: ClientUserUpdateRank,
    @Context() { req }: any
  ) {
    const id = this.clientUserService.getIdUserByHeaders(req.headers);

    await this.clientUserService.updateRank(id, data);

    return true;
  }

  @ResolveField()
  async updateScore(
    @Args('data') data: ClientUserUpdateScore,
    @Context() { req }: any
  ) {
    const id = this.clientUserService.getIdUserByHeaders(req.headers);
    
    await this.clientUserService.updateScore(id, data);

    return true;
  }
  
  @ResolveField()
  async updateJoinedCourse(
    @Args('data') data: ClientUserUpdateJoinedCourse,
    @Context() { req }: any
  ) {
    const id = this.clientUserService.getIdUserByHeaders(req.headers);

    await this.clientUserService.updateJoinedCourse(id, data);

    return true;
  }
  
  @ResolveField()
  async updateFollow(
    @Args('data') data: ClientUserUpdateFollow,
    @Context() { req }: any
  ) {
    const id = this.clientUserService.getIdUserByHeaders(req.headers);

    await this.clientUserService.updateFollow(id, data);

    return true;
  }

  @ResolveField()
  async updateCompletedCourses(
    @Args('idCourse') idCourse: string,
    @Context() { req }: any
  ) {
    const id = this.clientUserService.getIdUserByHeaders(req.headers);

    await this.clientUserService.updateCompletedCourses(id, idCourse);

    return true;
  }
}
