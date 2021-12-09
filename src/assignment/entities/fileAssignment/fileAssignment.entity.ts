import { BaseEntity } from "src/common/entity/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Assignment } from "../Assignment.entity";
import { GroupAssignment } from "./groupAssignment.entity";

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

    @ManyToOne(() => Assignment, fileAssignment => fileAssignment.fileAssignments)
    @JoinColumn()
    assignment: Assignment

    @OneToMany(() => GroupAssignment, (group) => group.fileAssignment)
    submittedGroupAssignments: GroupAssignment[]
}