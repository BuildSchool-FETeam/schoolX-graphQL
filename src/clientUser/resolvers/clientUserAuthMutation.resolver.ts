import { Args, Mutation, ResolveField, Resolver } from '@nestjs/graphql';
import { ClientUserSigninInput, ClientUserSignupInput } from 'src/graphql';
import { ClientUserService } from '../services/clientUser.service';

@Resolver('ClientUserAuthMutation')
export class ClientUserAuthMutationResolver {
  constructor(private clientUserService: ClientUserService) {}

  @Mutation()
  clientUserAuthMutation() {
    return {};
  }

  @ResolveField()
  signUp(@Args('data') data: ClientUserSignupInput) {
    return this.clientUserService.createClientUser(data);
  }

  @ResolveField()
  signIn(@Args('data') data: ClientUserSigninInput) {
    return this.clientUserService.loginWithEmailAndPassword(data);
  }

  @ResolveField()
  async activateAccount(
    @Args('email') email: string,
    @Args('activationCode') activationCode: string,
  ) {
    await this.clientUserService.activateAccount(email, activationCode);

    return true;
  }

  @ResolveField()
  async sendRestorePassword(@Args('email') email: string) {
    await this.clientUserService.sendRestorePassword(email);

    return true;
  }

  @ResolveField()
  async resetPassword(
    @Args('resetCode') resetCode: string,
    @Args('password') password: string,
    @Args('email') email: string,
  ) {
    await this.clientUserService.resetPassword(resetCode, password, email);

    return true;
  }
}
