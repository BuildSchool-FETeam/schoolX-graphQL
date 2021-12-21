import { Args, ResolveField, Resolver, Mutation } from '@nestjs/graphql';
import { AuthPayload, SignUpInput, SignInInput } from 'src/graphql';
import { AdminUserService } from 'src/adminUser/services/AdminUser.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PasswordService } from '../common/services/password.service';
import { TokenService } from '../common/services/token.service';

@Resolver('AdminAuthMutation')
export class AuthResolver {
  constructor(
    private adminUserService: AdminUserService,
    private tokenService: TokenService,
    private passwordService: PasswordService,
  ) {}

  @Mutation()
  adminAuthMutation() {
    return {};
  }

  @ResolveField()
  async signUp(@Args('data') data: SignUpInput): Promise<AuthPayload> {
    const user = await this.adminUserService.createUserBySignup({ ...data });
    return {
      token: this.tokenService.createToken({ ...user }),
      userName: user.name,
      role: user.role.name,
    };
  }

  @ResolveField()
  async signIn(@Args('data') data: SignInInput): Promise<AuthPayload> {
    const user = await this.adminUserService.findUserByEmail(data.email);

    if (!user) {
      throw new NotFoundException('User is not existed');
    }
    if (!this.passwordService.compare(data.password, user.password)) {
      throw new BadRequestException('Invalid password');
    }

    return {
      token: this.tokenService.createToken({ ...user }),
      userName: user.name,
      role: user.role.name,
    };
  }
}
