import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/services/base.service';
import { Repository } from 'typeorm';
import { Achievement } from '../entities/Achivement.entity';
import { ClientUser } from '../entities/ClientUser.entity';
import * as _ from "lodash";
import { Course } from 'src/courses/entities/Course.entity';
import { UpdateJoinedCourse, ActionCourse, ActionFollow } from 'src/graphql';
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

  async updateScore(id: string, score: number) {
    const existedAchi = await this.findById(id);
    const newScore = existedAchi.score + score

    existedAchi.score = newScore;

    return this.achiRepo.save(existedAchi);
  }

  async updateJoinedCourse(
    id: string, 
    data: UpdateJoinedCourse
  ) {

    const [existedAchi, course] = await Promise.all([
      this.findById(id, {relations: ["joinedCourse"]}),
      this.courseService.findById(data.idCourse)
    ]);
    const newCourses: Course[] = _.clone(existedAchi.joinedCourse);
    const checkAvailable = _.some(newCourses, ['id', course.id]);    

    if(data.action === ActionCourse.JOIN) {
      if(checkAvailable) { return false };
      newCourses.push(course);
    }else{
      if(!checkAvailable) { return false };
      _.remove(newCourses ,(course) => course.id.toString() === data.idCourse);
    }

    existedAchi.joinedCourse = newCourses;
    this.achiRepo.save(existedAchi);

    return true;
  }

  async updateFollow(
    id: string,
    userFollow: ClientUser,
    status: ActionFollow
  ){
    const existedAchi = await this.findById(id, {relations: ["follow"]});
    const follow: ClientUser[] = _.clone(existedAchi.follow);
    const checkAvailable = _.some(follow, ['id', userFollow.id]);

    if(status === ActionFollow.FOLLOW) {
      if(checkAvailable) { return false }
      follow.push(userFollow);
    }else {
      if(!checkAvailable) { return false }
      _.remove(follow ,(user) => user.id === userFollow.id);
    }

    existedAchi.follow = follow
    await this.achiRepo.save(existedAchi);

    return true; 
  }

  async updateFollowedMe(
    id: string,
    userFollowedMe: ClientUser,
    status: ActionFollow
  ) {
    const existedAchi = await this.findById(id, {relations: ["followedBy"]});
    const followedMe: ClientUser[] = _.clone(existedAchi.followedBy);

    if(status === ActionFollow.FOLLOW){
      followedMe.push(userFollowedMe)
    }else {
      _.remove(followedMe, (user) => user.id === userFollowedMe.id )
    }

    existedAchi.followedBy = followedMe;
    await this.achiRepo.save(existedAchi);

    return true; 
  }

  async updateCompletedCourses(
    id: string,
    idCourse: string
  ){
    const [existedAchi, course] = await Promise.all([
      this.findById(id),
      this.courseService.findById(idCourse)
    ]);

    const completedCourse: Course[] = _.clone(existedAchi.completedCourses)

    completedCourse.push(course);
    existedAchi.completedCourses = completedCourse;

    return this.achiRepo.save(existedAchi);
  }
}
