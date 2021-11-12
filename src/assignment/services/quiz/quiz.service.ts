import { BadRequestException, forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as _ from "lodash";
import { Assignment } from "src/assignment/entities/Assignment.entity";
import { BaseService } from "src/common/services/base.service";
import { LessonService } from "src/courses/services/lesson.service";
import { QuizSetInput } from "src/graphql";
import { Repository } from "typeorm";
import { Quiz } from "../../entities/quiz/Quiz.entity";
import { AssignmentService } from "../assignment.service";

@Injectable()
export class QuizService extends BaseService<Quiz> {
    constructor(
        @InjectRepository(Quiz)
        private quizRepo: Repository<Quiz>,
        @Inject(forwardRef(() => AssignmentService))
        private assignService: AssignmentService,
        @Inject(forwardRef(() => LessonService))
        private lessonService: LessonService
    ){
        super(quizRepo, "Quiz")
    }

    async create(data: QuizSetInput) {
        const { assignment } = await this.lessonService.findById(data.lessonId, {relations: ["assignment"]});

        let assign: Assignment;
        if(!assignment) {
            assign = await this.assignService.createAssignment(data.lessonId);
        }else{
            assign = await this.assignService.findById(assignment.id);
        }
        const newQuiz = await this.quizRepo.create({
            ...data,
            assignment: assign
        })

        return this.quizRepo.save(newQuiz);
    }

    async update(id: string, data: QuizSetInput) {
        const [lesson, quiz] = await Promise.all([
            this.lessonService.findById(data.lessonId, {relations: ["assignment"]}),
            this.findById(id, {relations: ["assignment"]})
          ])
         
        if(lesson.assignment.id !== quiz.assignment.id) {
            throw new BadRequestException(`Lesson with id ${lesson.id} is not contain this quiz`)
        }

        _.forOwn(data, (value, key) => {
            if(key === "lessonId"){
                quiz.assignment = lesson.assignment;
            }else {
                value && (quiz[key] = value);
            }
        });

        return this.quizRepo.save(quiz);
    }

    async delete(id: string) {
        const quiz = await this.findById(id, {
            relations: ["assignment"]
        });
        const assignment = await this.assignService.findById(quiz.assignment.id, {
            relations: ["quizs"]
        })

        const checkAvailable = _.some(assignment.quizs, ['id', parseInt(id)]);
      
        if(!checkAvailable) {
            return false;
        }

        const deleted = await this.deleteOneById(id);
        this.assignService.deleteAssgin(assignment.id);
          
        return !!deleted;
    }
}