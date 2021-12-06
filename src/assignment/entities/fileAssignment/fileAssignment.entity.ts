import { BaseEntity } from "src/common/entity/base.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
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

    @Column()
    description: string

    @Column()
    maxScore: number

    @Column()
    estimateTime: number

    @Column({nullable: true})
    instruction: string

    @Column({nullable: true})
    explain: string

    @OneToMany(() => Student, (Student) => Student.fileAssignment)
    @JoinColumn()
    studentSubmitted: Student[]
}