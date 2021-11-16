import { BaseEntity } from "src/common/entity/base.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToOne } from "typeorm";
import { Quiz } from "./Quiz.entity";

@Entity()
export class Question extends BaseEntity{

    @Column()
    order: number

    @ManyToOne(() => Quiz, quiz => quiz.questions, {
        onDelete: "CASCADE",
    })
    @JoinColumn()
    quiz: Quiz

    @Column("text", {array: true})
    options: string[]

    @Column()
    isMutiple: boolean

    @Column({nullable: true})
    result?: number

    @Column('int', {
        nullable: true, 
        array: true
    })
    results?: number[]

    @Column()
    timeByMinute: number
}