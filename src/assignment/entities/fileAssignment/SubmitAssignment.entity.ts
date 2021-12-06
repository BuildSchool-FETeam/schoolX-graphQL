import { UserComment } from "src/comment/entities/UserComment.entity";
import { BaseEntity } from "src/common/entity/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Student } from "./student.entity";

@Entity()
export class SubmitAssignment implements BaseEntity {
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
    order: number
    
    @Column()
    fileUrl: string

    @OneToMany(() => UserComment, (userComment) => userComment.submitAssignment)
    comments: UserComment[]

    @ManyToOne(() => Student, (student) => student.submitAssignments, {
        onDelete: 'CASCADE'
    })
    @JoinColumn()
    student: Student[]
}