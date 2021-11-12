import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as _  from "lodash";
import { BaseService } from "src/common/services/base.service";
import { QuestionSetInput } from "src/graphql";
import { Repository } from "typeorm";
import { Question } from "../../entities/quiz/Question.entity";
import { QuizService } from "./quiz.service";

@Injectable()
export class QuestionService extends BaseService<Question> {
    constructor(
        @InjectRepository(Question)
        private questionRepo: Repository<Question>,
        private quizService: QuizService
    ){
        super(questionRepo, "Question")
    }

    async create(data: QuestionSetInput) {
        const {idQuiz, results, ...infor} = data;
        const quiz = await this.quizService.findById(idQuiz);

        let result: number;
        let question: Question;

        if(!infor.isMutiple) {
            result = results[0]; 
            question = await this.questionRepo.create({
                ...infor,
                options: infor.options.join("|"),
                result,
                quiz
            })
        }else {
            question = await this.questionRepo.create({
                ...infor,
                options: infor.options.join("|"),
                results,
                quiz
            })
        }
        
        return this.questionRepo.save(question);
    }

    async update(id: string, data: QuestionSetInput) {
        const [question, quiz] = await Promise.all([
            this.findById(id, {relations: ["quiz"]}),
            this.quizService.findById(data.idQuiz)
        ])

        const {results, ...info} = data;
        let newData;

        if(!info.isMutiple) {
            newData = {...info, result: results[0]}
        }else { newData = {...info, results: results} }

        _.forOwn(newData, (value, key) => {
            if(key === "idQuiz" && question.quiz.id !== quiz.id) {
                question.quiz = quiz
            }else if(key === "options") {
                question.options = data.options.join("|")
            }else {
                value && (question[key] = value)
            }
        })

        return this.questionRepo.save(question);
    }
} 