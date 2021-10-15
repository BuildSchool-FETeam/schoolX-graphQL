import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/services/base.service';
import { Repository } from 'typeorm';
import { Achievement } from '../entities/Achivement.entity';
import { ClientUser } from '../entities/ClientUser.entity';
import * as _ from "lodash";
import { Course } from 'src/courses/entities/Course.entity';
import { ClientUserUpdateFollow, ClientUserUpdateJoinedCourse, StatusCourse, StatusFollow } from 'src/graphql';
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
    let newCourses: Course[] = !existedAchi.joinedCourse ? [] : existedAchi.joinedCourse;

    if(data.direction === StatusCourse.JOIN) {
      newCourses.push(course);
    }else {
      newCourses = newCourses.filter((course) => course.id !== data.idCourse);
    }

    existedAchi.joinedCourse = newCourses;

    return this.achiRepo.save(existedAchi);
  }

  async updateFollow(
    id: string,
    userFollow: ClientUser,
    status: StatusFollow
  ){
    const existedAchi = await this.findById(id);
    let follow = !existedAchi.follow ? [] : existedAchi.follow;

    if(status === StatusFollow.FOLLOW) {
      follow.push(userFollow);
    }else {
      follow = follow.filter((user) => user.id !== userFollow.id);
    }
    existedAchi.follow = follow

    return this.achiRepo.save(existedAchi);
  }

  async updateFollowedMe(
    id: string,
    userFollowedMe: ClientUser,
    status: StatusFollow
  ) {
    const existedAchi = await this.findById(id);
    let followedMe = !existedAchi.followedBy ? [] : existedAchi.followedBy;

    if(status === StatusFollow.FOLLOW){
      followedMe.push(userFollowedMe)
    }else {
      followedMe = followedMe.filter(user => user.id !== userFollowedMe.id);
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

    let completedCourse = !existedAchi.completedCourses ? [] : existedAchi.completedCourses;

    completedCourse.push(course);
    existedAchi.completedCourses = completedCourse;

    return this.achiRepo.save(existedAchi);
  }
}
