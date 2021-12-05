import { BaseEntity } from "src/common/entity/base.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Quiz } from "./Quiz.entity";

@Entity()
export class Question extends BaseEntity{

    @Column({nullable: true})
    order: number

    @ManyToOne(() => Quiz, quiz => quiz.questions, {
        onDelete: "CASCADE",
    })
    @JoinColumn()
    quiz: Quiz

    @Column("text", {array: true, nullable: true})
    options: string[]

    @Column({nullable: true})
    isMutiple: boolean

    @Column({nullable: true})
    result?: number

    @Column('int', {
        nullable: true, 
        array: true
    })
    results?: number[]
}