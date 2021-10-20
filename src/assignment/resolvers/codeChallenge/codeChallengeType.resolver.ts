import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { CodeChallenge } from "src/assignment/entities/CodeChallenge.entity";
import { CodeChallengeService } from "src/assignment/services/codeChallenge.service";

@Resolver('CodeChallengeType')
export class CodeChallengeTypeResolver {

    constructor(
        private codeChallengeService: CodeChallengeService
    ) {}

    @ResolveField()
    async testCases(@Parent() parent: CodeChallenge) {
        const codeChallenge = await this.codeChallengeService.findById(parent.id, {
            relations: ['testCases'],
        });

        return codeChallenge.testCases;
    }

    @ResolveField()
    async languageSupport(@Parent() parent: CodeChallenge) {
        return parent.languageSupport.split('|');
    }
}