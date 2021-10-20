import { BaseEntity } from "src/common/entity/base.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany } from "typeorm";
import { Assignment } from "./Assignment.entity";
import { Question } from "./Question.entity";

@Entity()
export class Quiz extends BaseEntity{

    @ManyToOne(() => Assignment, assignment => assignment.quizs, {
        onDelete: "CASCADE"
    })
    @JoinColumn()
    assignment: Assignment

    @Column()
    description: string

    @OneToMany(() => Question, question => question.quiz)
    questions: Question[]
}