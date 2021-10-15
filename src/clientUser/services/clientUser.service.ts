import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/services/base.service';
import { 
  ClientUserUpdateFollow,
  ClientUserUpdateInput, 
  ClientUserUpdateJoinedCourse, 
  ClientUserUpdateRank, 
  ClientUserUpdateScore, 
  StatusScoreAndRank } from 'src/graphql';
import { Repository } from 'typeorm';
import { ClientUser } from '../entities/ClientUser.entity';
import * as _ from 'lodash';
import {
  GCStorageService,
  StorageFolder,
} from 'src/common/services/GCStorage.service';
import { FileUploadType } from 'src/common/interfaces/ImageUpload.interface';
import { AchievementService } from './achievement.service';
import { CourseService } from 'src/courses/services/course.service';

@Injectable()
export class ClientUserService extends BaseService<ClientUser> {
  constructor(
    @InjectRepository(ClientUser)
    private clientRepo: Repository<ClientUser>,
    private gcStorageService: GCStorageService,
    private achievementService: AchievementService,
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

  async updateRank(
    id: string,
    data: ClientUserUpdateRank
  ) {
    const existedUser = await this.findById(id, {relations: ["achievement"]});

    if(data.direction === StatusScoreAndRank.DOWN) {
      this.achievementService.updateRank(existedUser.achievement.id, data.rank);
    }else this.achievementService.updateRank(existedUser.achievement.id, 0 - data.rank);

  }

  async updateScore(
    id: string,
    data: ClientUserUpdateScore
  ) {
    const existedUser = await this.findById(id, {relations: ["achievement"]});

    if(data.direction === StatusScoreAndRank.DOWN) {
      this.achievementService.updateScore(existedUser.achievement.id, 0 - data.score);
    }else this.achievementService.updateScore(existedUser.achievement.id, data.score);
  }

  async updateJoinedCourse(
    id: string,
    data: ClientUserUpdateJoinedCourse
  ){
    const {achievement} = await this.findById(id, {relations: ["achievement"]});
    
    this.achievementService.updateJoinedCourse(achievement.id, data);
  }

  async updateFollow(
    id: string,
    data: ClientUserUpdateFollow
  ){
    const [existedUser, userFollow] = await Promise.all([
      this.findById(id, {relations: ["achievement"]}),
      this.findById(data.idFollow, {relations: ["achievement"]})
    ]);
  
     Promise.all([
      this.achievementService.updateFollow(
        existedUser.achievement.id,
        userFollow,
        data.direction
      ),
      this.achievementService.updateFollowedMe(
        userFollow.achievement.id,
        existedUser,
        data.direction
      )
    ])
  }

  async updateCompletedCourses(
    id: string,
    idCourse: string
  ){
    const {achievement} = await this.findById(id, {relations: ["achievement"]});

    this.achievementService.updateCompletedCourses(achievement.id, idCourse)
  }
}
