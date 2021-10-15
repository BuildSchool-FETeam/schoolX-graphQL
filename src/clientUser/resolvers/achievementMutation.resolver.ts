import { UseGuards } from "@nestjs/common";
import { Args, Mutation, ResolveField, Resolver } from "@nestjs/graphql";
import { AuthGuard } from "src/common/guards/auth.guard";
import { AchievementUpdateRankOrScore } from "src/graphql";
import { Achievement } from "../entities/Achivement.entity";
import { AchievementService } from "../services/achievement.service";

@UseGuards(AuthGuard)
@Resolver('AchievementMutation')
export class AchievementMutationResolver {
    constructor(private achiService: AchievementService){}

    @Mutation()
    achievementMutation() {
        return {};
    }

    @ResolveField()
    updateRankOrScore(
        @Args('id') id: string,
        @Args('data') data: AchievementUpdateRankOrScore
    ): Promise<Achievement> {
        return this.achiService.updateRankOrScore(id, data);
    }

    @ResolveField()
    updateJoinedCourse(
        @Args('id') id: string,
        @Args('idCourse') idCourse: string
    ): Promise<Achievement> {
        return this.achiService.updateJoinedCourse(id, idCourse);
    }

    @ResolveField()
    updateFollow(
        @Args('id') id: string,
        @Args('idFollow') idFollow: string
    ): Promise<Achievement> {
        return this.achiService.updateFollow(id, idFollow);
    }

    @ResolveField()
    updateCompletedCourses(
        @Args('id') id: string,
        @Args('idCourse') idCourse: string
    ): Promise<Achievement> {
        return this.achiService.updateCompletedCourse(id, idCourse);
    }
}