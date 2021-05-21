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
}
