import { BaseEntity } from "src/common/entity/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Student } from "./student.entity";

@Entity()
export class Submit implements BaseEntity {
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

    @ManyToOne(() => Student, (student) => student.submits, {
        onDelete: 'CASCADE'
    })
    @JoinColumn()
    student: Student[]
}