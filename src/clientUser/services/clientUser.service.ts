import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/services/base.service';
import { ClientUserUpdateInput } from 'src/graphql';
import { Repository } from 'typeorm';
import { ClientUser } from '../entities/ClientUser.entity';
import * as _ from 'lodash';
import {
  GCStorageService,
  StorageFolder,
} from 'src/common/services/GCStorage.service';
import { FileUploadType } from 'src/common/interfaces/ImageUpload.interface';

@Injectable()
export class ClientUserService extends BaseService<ClientUser> {
  constructor(
    @InjectRepository(ClientUser)
    private clientRepo: Repository<ClientUser>,
    private gcStorageService: GCStorageService,
  ) {
    super(clientRepo, 'clientUser');
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
      imageProcessConfig: {
        resize: {
          height: 450,
          width: 450,
        },
        changeFormat: 'jpeg',
      },
    });

    existedUser.filePath = filePath;
    existedUser.imageUrl = publicUrl;

    return this.clientRepo.save(existedUser);
  }
}
