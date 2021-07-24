import { UseGuards } from '@nestjs/common';
import { Args, Mutation, ResolveField, Resolver } from '@nestjs/graphql';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ClientUserUpdateInput, Upload } from 'src/graphql';
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
}
