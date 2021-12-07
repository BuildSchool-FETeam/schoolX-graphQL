import { BaseEntity } from "src/common/entity/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Assignment } from "../Assignment.entity";
import { SubmittedAssignment } from "./SubmitAssignment.entity";

@Entity()
export class FileAssignment extends BaseEntity {

    @Column({nullable: true})
    description: string

    @Column()
    maxScore: number

    @Column()
    estimateTimeInMinute: number

    @Column({nullable: true})
    contentInstruct: string

    @Column({nullable: true})
    videoInstruct: string

    @Column({nullable: true})
    explainContent: string

    @Column({nullable: true})
    explainVideo: string

    @OneToMany(() => SubmittedAssignment, (submittedAssignment) => submittedAssignment.fileAssignment)
    submitteds: SubmittedAssignment[]

    @ManyToOne(() => Assignment, fileAssignment => fileAssignment.fileAssignments)
    @JoinColumn()
    assignment: Assignment
}