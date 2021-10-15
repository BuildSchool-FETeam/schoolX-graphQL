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
    });

    return this.achiRepo.save(existedAchievement);
  }

  async updateJoinedCourse(id: string, idCourse: string): Promise<Achievement> {
    const [existedAchi, course] = await Promise.all([
      this.findById(id),
      this.courseService.findById(idCourse)
    ])
    
    if(!existedAchi.joinedCourse) existedAchi.joinedCourse = [course];
    else existedAchi.joinedCourse.push(course);
    
    return this.achiRepo.save(existedAchi);
  }

  async updateFollow(id: string, idAchiFollow: string): Promise<Achievement> {
    const [existAchi, user] = await Promise.all([
      this.findById(id),
      this.findById(idAchiFollow)
    ])

    this.updateFollowedBy(idAchiFollow, id);

    if(!existAchi.follow) existAchi.follow = [user]
    else existAchi.follow.push(user)

    return this.achiRepo.save(existAchi);
  }

  async updateFollowedBy(id: string, idAchiFollowMe: string): Promise<Achievement> {
    const [existedAchi, achiFollowMe] = await Promise.all([
      this.findById(id),
      this.findById(idAchiFollowMe)
    ])

    if(!existedAchi.followedBy) existedAchi.followedBy = [achiFollowMe];
    else existedAchi.followedBy.push(achiFollowMe)

    return this.achiRepo.save(existedAchi);
  }

  async updateCompletedCourse(id: string, idCourse: string): Promise<Achievement> {
    const [existedAchi, course] = await Promise.all([
      this.findById(id),
      this.courseService.findById(idCourse)
    ]);

    if(!existedAchi.completedCourses) existedAchi.completedCourses = [course];
    else existedAchi.completedCourses.push(course)
    
    return this.achiRepo.save(existedAchi);
  }
}
