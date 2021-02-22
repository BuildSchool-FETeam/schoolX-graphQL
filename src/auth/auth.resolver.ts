import { PasswordService } from './../common/services/password.service';
import { AuthService } from './services/auth.service';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthPayload, SignUpInput, SignInInput } from 'src/graphql';
import { UserService } from 'src/User/services/user.service';

@Resolver()
export class AuthResolver {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private passwordService: PasswordService
  ) { }

  @Mutation()
  async signUp (@Args('data') data: SignUpInput): Promise<AuthPayload> {
    const user = await this.userService.createUserBySignup({ ...data });
    return {
      token: this.authService.createToken(user),
      userName: user.name,
      role: user.role.name,
    };
  }

  @Mutation()
  async signIn (@Args('data') data: SignInInput): Promise<AuthPayload> {
    const user = await this.userService.findUserByEmail(data.email);

    if (!user) {
      throw Error('User is not existed')
    }

    if (!this.passwordService.compare(data.password, user.password)) {
      throw Error('Invalid password')
    }

    return {
      token: this.authService.createToken({ ...user }),
      userName: user.name,
      role: user.role.name,
    };
  }
}
