import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import _ from "lodash";
import { Assignment } from "src/assignment/entities/Assignment.entity";
import { BaseService } from "src/common/services/base.service";
import { QuizSetInput } from "src/graphql";
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

    async createQuiz(data: QuizSetInput, assignment: Assignment) {
        const newQuiz = await this.quizRepo.create({
            ...data,
            assignment
        })

        return this.quizRepo.save(newQuiz);
    }

    async updateQuiz(id: string, data: QuizSetInput, assignment?: Assignment) {
        const quiz = await this.findById(id);

        _.forOwn(data, (value, key) => {
            if('assignmentId' === key && assignment){
                quiz.assignment =  assignment;
            }else {
                value && (quiz[key] = value);
            }
        });

        return this.quizRepo.save(quiz);
    }
}