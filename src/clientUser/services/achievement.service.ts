import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/services/base.service';
import { Repository } from 'typeorm';
import { Achievement } from '../entities/Achivement.entity';
import { ClientUser } from '../entities/ClientUser.entity';
import * as _ from "lodash";
import { AchievementUpdateRankOrScore } from 'src/graphql';
import { CourseService } from 'src/courses/services/course.service';
import { ClientUserService } from './clientUser.service';

@Injectable()
export class AchievementService extends BaseService<Achievement> {
  constructor(
    @InjectRepository(Achievement)
    private achiRepo: Repository<Achievement>,
    private courseService: CourseService,
    private clientUserService: ClientUserService
  ) {
    super(achiRepo, 'User achievement');
  }

  createEmptyAchievement(clientUser: ClientUser) {
    const data = this.achiRepo.create({
      rank: 0,
      score: 0,
      clientUser: clientUser,
    });
    return this.achiRepo.save(data);
  }

  async updateRankOrScore(id: string, data: AchievementUpdateRankOrScore): Promise<Achievement> {
    const existedAchievement = await this.findById(id);
    _.forOwn(data, (value, key) => {
      value && (existedAchievement[key] += value);
    })

    return this.achiRepo.save(existedAchievement);
  }

  async updateJoinedCourse(id: string, idCourse: string): Promise<Achievement> {
    const existedAchievement = await this.findById(id);
    const course = await this.courseService.updateJoinedCourse(idCourse, existedAchievement);

    existedAchievement['joinedCourse'].push(course);
    
    return this.achiRepo.save(existedAchievement);
  }

  async updateFollow(id: string, idUser: string): Promise<Achievement> {

    const existedAchievement = await this.findById(id);
    const existedUser = await this.clientUserService.findById(idUser);

    existedAchievement['follow'].push(existedUser);

    return this.achiRepo.save(existedAchievement);
  }

  async updateFollowedBy(id: string, idUser: string): Promise<Achievement> {

    const existedAchievement = await this.findById(id);
    const existedUser = await this.clientUserService.findById(idUser);

    existedAchievement['followedBy'].push(existedUser);

    return this.achiRepo.save(existedAchievement);
  }

  async updateCompletedCourse(id: string, idCourse: string): Promise<Achievement> {
    const existedAchievement = await this.findById(id);
    const course = await this.courseService.updateJoinedCourse(idCourse, existedAchievement);

    existedAchievement['completedCourses'].push(course);
    
    return this.achiRepo.save(existedAchievement);
  }
}
