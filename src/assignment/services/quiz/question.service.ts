import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "src/common/services/base.service";
import { Repository } from "typeorm";
import { Question } from "../../entities/quiz/Question.entity";

@Injectable()
export class QuestionService extends BaseService<Question> {
    constructor(
        @InjectRepository(Question)
        private questionRepo: Repository<Question>
    ){
        super(questionRepo, "Question")
    }
} 