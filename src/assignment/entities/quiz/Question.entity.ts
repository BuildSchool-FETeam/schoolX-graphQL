import { BaseEntity } from "src/common/entity/base.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToOne } from "typeorm";
import { Quiz } from "./Quiz.entity";

@Entity()
export class Question extends BaseEntity{

    @ManyToOne(() => Quiz, quiz => quiz.questions, {
        onDelete: "CASCADE"
    })
    @JoinColumn()
    quiz: Quiz

    @Column()
    options: string

    @Column()
    result: string
}