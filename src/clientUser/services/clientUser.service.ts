import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/services/base.service';
import { PasswordService } from 'src/common/services/password.service';
import { TokenService } from 'src/common/services/token.service';
import { ClientUserSigninInput, ClientUserSignupInput } from 'src/graphql';
import { PermissionService } from 'src/permission/services/permission.service';
import { Repository } from 'typeorm';
import { ClientUser } from '../entities/ClientUser.entity';
import * as _ from 'lodash';
import { AchievementService } from './achievement.service';

@Injectable()
export class ClientUserService extends BaseService<ClientUser> {
  constructor(
    @InjectRepository(ClientUser)
    private clientRepo: Repository<ClientUser>,
    private achiService: AchievementService,
    private permissionService: PermissionService,
    private passwordService: PasswordService,
    private tokenService: TokenService,
  ) {
    super(clientRepo, 'clientUser');
  }

  async createClientUser(data: ClientUserSignupInput) {
    const { email, password, name } = data;
    const existedData = await this.findWithOptions({
      where: { email },
    });

    if (_.size(existedData) > 0) {
      throw new BadRequestException('This email has been taken');
    }
    const newClientUser = this.clientRepo.create({
      email,
      password: this.passwordService.hash(password),
      name,
    });

    newClientUser.role = await this.permissionService.getClientUserPermission();
    const clientUserResponse = await this.clientRepo.save(newClientUser);

    await this.achiService.createEmptyAchievement(clientUserResponse);

    return {
      id: clientUserResponse.id,
      email: clientUserResponse.email,
      token: this.tokenService.createToken({ ...clientUserResponse }),
    };
  }

  async loginWithEmailAndPassword(data: ClientUserSigninInput) {
    const { email, password } = data;
    const existedUser = await this.findWithOptions({
      where: { email },
    });

    if (_.size(existedUser) === 0) {
      throw new ForbiddenException("This email doesn't exist yet");
    }

    const [existedClientUser] = existedUser;
    const compareResult = this.passwordService.compare(
      password,
      existedClientUser.password,
    );

    if (!compareResult) {
      throw new ForbiddenException('Password is invalid');
    }

    return {
      id: existedClientUser.id,
      email: existedClientUser.email,
      token: this.tokenService.createToken({ ...existedClientUser }),
    };
  }
}
