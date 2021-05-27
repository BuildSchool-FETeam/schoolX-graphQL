import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/services/base.service';
import { PasswordService } from 'src/common/services/password.service';
import { TokenService } from 'src/common/services/token.service';
import {
  ClientUserSigninInput,
  ClientUserSignupInput,
  ClientUserUpdateInput,
} from 'src/graphql';
import { PermissionService } from 'src/permission/services/permission.service';
import { Repository } from 'typeorm';
import { ClientUser } from '../entities/ClientUser.entity';
import * as _ from 'lodash';
import { AchievementService } from './achievement.service';
import {
  GCStorageService,
  StorageFolder,
} from 'src/common/services/GCStorage.service';
import { FileUploadType } from 'src/common/interfaces/ImageUpload.interface';
import { MailGunService } from 'src/Email/services/mailGun.service';

@Injectable()
export class ClientUserService extends BaseService<ClientUser> {
  private SENDER = 'schoolx.dev.001@gmail.com';

  constructor(
    @InjectRepository(ClientUser)
    private clientRepo: Repository<ClientUser>,
    private achiService: AchievementService,
    private permissionService: PermissionService,
    private passwordService: PasswordService,
    private tokenService: TokenService,
    private gcStorageService: GCStorageService,
    private emailService: MailGunService,
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

    const { expiredTime, code } = this.generateActivationCode(1);
    newClientUser.activationCode = code;
    newClientUser.activationCodeExpire = expiredTime;

    await this.sendEmailWithCode(code, email);

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
    const existedClientUser = await this.getClientUserFromEmail(email);

    if (!existedClientUser.isActive) {
      throw new ForbiddenException(
        'This client user is inactive! Please try active it first!',
      );
    }

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

  async updateClientUserInfo(data: ClientUserUpdateInput, id: string) {
    const existedUser = await this.findById(id);

    _.forOwn(data, (value, key) => {
      value && (existedUser[key] = value);
    });

    return this.clientRepo.save(existedUser);
  }

  async updateUserAvatar(
    id: string,
    { createReadStream, filename }: FileUploadType,
  ) {
    const existedUser = await this.findById(id);

    if (existedUser.imageUrl) {
      this.gcStorageService.deleteFile(existedUser.filePath);
    }

    const { filePath, publicUrl } = await this.gcStorageService.uploadFile({
      fileName: filename,
      readStream: createReadStream(),
      type: StorageFolder.ClientUsers,
      makePublic: true,
      additionalPath: existedUser.email,
    });

    existedUser.filePath = filePath;
    existedUser.imageUrl = publicUrl;

    return this.clientRepo.save(existedUser);
  }

  async activateAccount(email: string, code: string) {
    const clientUser = await this.getClientUserFromEmail(email);

    if (!this.checkActivationCodeValid(clientUser)) {
      throw new BadRequestException('Activation code has been expired');
    }

    if (clientUser.activationCode !== code) {
      throw new BadRequestException('Activation code is invalid!');
    }

    clientUser.isActive = 1;
    clientUser.activationCodeExpire = 0;
    clientUser.activationCode = '';

    return this.clientRepo.save(clientUser);
  }

  async sendRestorePassword(email: string) {
    const clientUser = await this.getClientUserFromEmail(email);
    const { code, expiredTime } = this.generateActivationCode(1);

    clientUser.activationCode = code;
    clientUser.activationCodeExpire = expiredTime;

    await this.clientRepo.save(clientUser);
    return this.sendEmailWithCode(code, email, 'Reset password');
  }

  async resetPassword(code: string, password: string, email: string) {
    const clientUser = await this.getClientUserFromEmail(email);

    if (clientUser.activationCode !== code) {
      throw new BadRequestException('Your activation code is invalid!');
    }

    if (!this.checkActivationCodeValid(clientUser)) {
      throw new BadRequestException('Activation code has been expired!');
    }

    clientUser.password = this.passwordService.hash(password);
    return this.clientRepo.save(clientUser);
  }

  private async getClientUserFromEmail(email: string) {
    const existedUser = await this.findWithOptions({
      where: { email },
    });

    if (_.size(existedUser) === 0) {
      throw new ForbiddenException("This email doesn't exist yet");
    }

    const [existedClientUser] = existedUser;

    return existedClientUser;
  }

  private checkActivationCodeValid(clientUser: ClientUser) {
    const now = Date.now();
    return clientUser.activationCodeExpire > now;
  }

  private async sendEmailWithCode(
    code: string,
    email: string,
    emailSubject?: string,
  ) {
    await this.emailService.sendMailWithCode({
      messageConfig: {
        from: this.SENDER,
        to: email,
        subject: emailSubject || 'Activation Code',
      },
      templateName: 'TEMP_RESET_PASSWORD',
      code,
    });
  }
}
