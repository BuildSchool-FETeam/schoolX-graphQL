import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "src/common/services/base.service";
import { Repository } from "typeorm";
import { Quiz } from "../../entities/quiz/Quiz.entity";

@Injectable()
export class QuizService extends BaseService<Quiz> {
    constructor(
        @InjectRepository(Quiz)
        private quizRepo: Repository<Quiz>
    ){
        super(quizRepo, "Quiz")
    }
}