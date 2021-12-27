import { Args, Mutation, ResolveField, Resolver } from '@nestjs/graphql'
import { ClientUserSigninInput, ClientUserSignupInput } from 'src/graphql'
import { ClientAuthService } from '../services/clientAuth.service'

@Resolver('ClientUserAuthMutation')
export class ClientUserAuthMutationResolver {
  constructor(private clientAuthService: ClientAuthService) {}

  @Mutation()
  clientUserAuthMutation() {
    return {}
  }

  @ResolveField()
  async signUp(@Args('data') data: ClientUserSignupInput) {
    return this.clientAuthService.createClientUser(data)
  }

  @ResolveField()
  async signIn(@Args('data') data: ClientUserSigninInput) {
    return this.clientAuthService.loginWithEmailAndPassword(data)
  }

  @ResolveField()
  async activateAccount(
    @Args('email') email: string,
    @Args('activationCode') activationCode: string
  ) {
    await this.clientAuthService.activateAccount(email, activationCode)

    return true
  }

  @ResolveField()
  async sendRestorePassword(@Args('email') email: string) {
    await this.clientAuthService.sendRestorePassword(email)

    return true
  }

  @ResolveField()
  async resetPassword(
    @Args('resetCode') resetCode: string,
    @Args('password') password: string,
    @Args('email') email: string
  ) {
    await this.clientAuthService.resetPassword(resetCode, password, email)

    return true
  }
}
