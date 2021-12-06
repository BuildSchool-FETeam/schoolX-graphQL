import { BaseEntity } from "src/common/entity/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Assignment } from "../Assignment.entity";
import { Student } from "./student.entity";

@Entity()
export class FileAssignment implements BaseEntity {
    @PrimaryGeneratedColumn()
    id: string

    @Column()
    title: string

    @Column()
    createdAt: Date
    
    @Column()
    updatedAt: Date

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

    @OneToMany(() => Student, (fileAssignment) => fileAssignment.fileAssignment)
    students: Student[]

    @ManyToOne(() => Assignment, fileAssignment => fileAssignment.fileAssignments)
    @JoinColumn()
    assignment: Assignment
}