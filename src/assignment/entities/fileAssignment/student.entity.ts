import { ClientUser } from "src/clientUser/entities/ClientUser.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { FileAssignment } from "./fileAssignment.entity";
import { SubmitAssignment } from "./SubmitAssignment.entity";

@Entity()
export class Student {
    @PrimaryGeneratedColumn()
    id: string

    @OneToOne(() => ClientUser)
    @JoinColumn()
    user: ClientUser

    @Column({nullable: true})
    reApply?: boolean

    @OneToMany(() => SubmitAssignment, (submitAssignment) => submitAssignment.student)
    submitAssignments: SubmitAssignment[]

    @ManyToOne(() => FileAssignment, (fileAssignment) => fileAssignment.students, {
        onDelete: "CASCADE"
    })
    @JoinColumn()
    fileAssignment: FileAssignment
}