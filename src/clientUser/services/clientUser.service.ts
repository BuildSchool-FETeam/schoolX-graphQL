import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/services/base.service';
import { 
  UpdateFollow,
  ClientUserUpdateInput, 
  UpdateJoinedCourse,  
  UpdateScore, 
} from 'src/graphql';
import { Repository } from 'typeorm';
import { ClientUser } from '../entities/ClientUser.entity';
import * as _ from 'lodash';
import {
  GCStorageService,
  StorageFolder,
} from 'src/common/services/GCStorage.service';
import { FileUploadType } from 'src/common/interfaces/ImageUpload.interface';
import { AchievementService } from './achievement.service';
import { TokenService } from 'src/common/services/token.service';
import { CourseService } from 'src/courses/services/course.service';

@Injectable()
export class ClientUserService extends BaseService<ClientUser> {
  constructor(
    @InjectRepository(ClientUser)
    private clientRepo: Repository<ClientUser>,
    private gcStorageService: GCStorageService,
    private achievementService: AchievementService,
    private tokenService: TokenService,
    private courseService: CourseService
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

  async updateScore(
    id: string,
    data: UpdateScore
  ) {
    const existedUser = await this.findById(id, {relations: ["achievement"]});

    if(!data.isAdd) {
      this.achievementService.updateScore(existedUser.achievement.id, 0 - data.score);
    }else this.achievementService.updateScore(existedUser.achievement.id, data.score);
  }

  async updateJoinedCourse(
    id: string,
    data: UpdateJoinedCourse
  ){
    const user = await this.findById(id, {relations: ["achievement"]});
    const { achievement } = user;

    return Promise.all([
      this.achievementService.updateJoinedCourse(achievement.id, data),
      this.courseService.updateJoinedUsers(data.idCourse, user, data.action)
    ]).then(res => res[0] && res[1]);
  }

  async updateFollow(
    id: string,
    data: UpdateFollow
  ){
    const [existedUser, userFollow] = await Promise.all([
      this.findById(id, {relations: ["achievement"]}),
      this.findById(data.idFollow, {relations: ["achievement"]})
    ]);
  
    return Promise.all([
      this.achievementService.updateFollow(
        existedUser.achievement.id,
        userFollow,
        data.action
      ),
      this.achievementService.updateFollowedMe(
        userFollow.achievement.id,
        existedUser,
        data.action
      )
    ]).then(res => res[0] && res[1]);
  }

  async updateCompletedCourses(
    id: string,
    idCourse: string
  ){
    const { achievement } = await this.findById(id, { relations: ["achievement"] });

    this.achievementService.updateCompletedCourses(achievement.id, idCourse)
  }

  getIdUserByHeaders(headers) {
    const token = this.getTokenFromHttpHeader(headers);
    const { id } = this.tokenService.verifyAndDecodeToken(token);

    return id;
  }
}
