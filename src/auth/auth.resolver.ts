import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthPayload, SignUpInput } from 'src/graphql';
import { UserService } from 'src/user/user.service';

@Resolver()
export class AuthResolver {
  constructor(private userService: UserService) {}

  @Mutation()
  async signUp(@Args('data') data: SignUpInput): Promise<AuthPayload> {
    // FIXME:
    const user = await this.userService.createUser({ ...data });
    return {
      token: 'dmm',
      userName: user.name,
      role: user.role as any,
    };
  }
}
