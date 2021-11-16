import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as _  from "lodash";
import { BaseService } from "src/common/services/base.service";
import { QuestionSetInput } from "src/graphql";
import { Repository } from "typeorm";
import { Question } from "../../entities/quiz/Question.entity";

@Injectable()
export class QuestionService extends BaseService<Question> {
    constructor(
        @InjectRepository(Question)
        private questionRepo: Repository<Question>,
    ){
        super(questionRepo, "Question")
    }

    async saveData(data: QuestionSetInput[]) {
        return this.questionRepo.save(data);
    }

    async delete(data: Question[]) {
        return this.questionRepo.remove(data);
    }
} 