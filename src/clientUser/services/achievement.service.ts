import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/services/base.service';
import { Repository } from 'typeorm';
import { Achievement } from '../entities/Achivement.entity';
import { ClientUser } from '../entities/ClientUser.entity';
import * as _ from "lodash";
import { Course } from 'src/courses/entities/Course.entity';
import { ClientUserUpdateJoinedCourse, ActionCourse, ActionFollow } from 'src/graphql';
import { CourseService } from 'src/courses/services/course.service';

@Injectable()
export class AchievementService extends BaseService<Achievement> {
  constructor(
    @InjectRepository(Achievement)
    private achiRepo: Repository<Achievement>,
    private courseService: CourseService
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

  async updateRank(id: string, rank: number) {
    const existedAchi = await this.findById(id);
    const newRank = existedAchi.rank + rank;

    existedAchi.rank = newRank;

    return this.achiRepo.save(existedAchi);
  }

  async updateScore(id: string, score: number) {
    const existedAchi = await this.findById(id);
    const newScore = existedAchi.score + score

    existedAchi.score = newScore;

    return this.achiRepo.save(existedAchi);
  }

  async updateJoinedCourse(
    id: string, 
    data: ClientUserUpdateJoinedCourse
  ) {

    const [existedAchi, course] = await Promise.all([
      this.findById(id),
      this.courseService.findById(data.idCourse)
    ]);
    const newCourses: Course[] = !existedAchi.joinedCourse ? [] : existedAchi.joinedCourse;

    if(data.action === ActionCourse.JOIN) {
      newCourses.push(course);
    }else {
      _.remove(newCourses ,(course) => course.id !== data.idCourse);
    }

    existedAchi.joinedCourse = newCourses;

    return this.achiRepo.save(existedAchi);
  }

  async updateFollow(
    id: string,
    userFollow: ClientUser,
    status: ActionFollow
  ){
    const existedAchi = await this.findById(id);
    const follow = !existedAchi.follow ? [] : existedAchi.follow;

    if(status === ActionFollow.FOLLOW) {
      follow.push(userFollow);
    }else {
      _.remove(follow ,(user) => user.id !== userFollow.id);
    }
    existedAchi.follow = follow

    return this.achiRepo.save(existedAchi);
  }

  async updateFollowedMe(
    id: string,
    userFollowedMe: ClientUser,
    status: ActionFollow
  ) {
    const existedAchi = await this.findById(id);
    const followedMe = !existedAchi.followedBy ? [] : existedAchi.followedBy;

    if(status === ActionFollow.FOLLOW){
      followedMe.push(userFollowedMe)
    }else {
      _.remove(followedMe, (user) => user.id !== userFollowedMe.id )
    }

    existedAchi.followedBy = followedMe;

    return this.achiRepo.save(existedAchi);
  }

  async updateCompletedCourses(
    id: string,
    idCourse: string
  ){
    const [existedAchi, course] = await Promise.all([
      this.findById(id),
      this.courseService.findById(idCourse)
    ]);

    const completedCourse = !existedAchi.completedCourses ? [] : existedAchi.completedCourses;

    completedCourse.push(course);
    existedAchi.completedCourses = completedCourse;

    return this.achiRepo.save(existedAchi);
  }
}
