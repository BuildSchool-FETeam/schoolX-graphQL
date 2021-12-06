import { ClientUser } from "src/clientUser/entities/ClientUser.entity";
import { UserComment } from "src/comment/entities/UserComment.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { FileAssignment } from "./fileAssignment.entity";
import { Submit } from "./submit.entity";

@Entity()
export class Student {
    @PrimaryGeneratedColumn()
    id: string

    @Column({default: 0})
    score: number

    @OneToMany(() => UserComment, (userComment) => userComment.student)
    @JoinColumn()
    comments: UserComment[]

    @ManyToOne(() => ClientUser)
    @JoinColumn()
    student: ClientUser

    @Column({nullable: true})
    reApply?: boolean

    @OneToMany(() => Submit, (submit) => submit.student)
    @JoinColumn()
    submits: Submit[]

    @ManyToOne(() => FileAssignment, (fileAssignment) => fileAssignment.studentSubmitted, {
        onDelete: 'CASCADE'
    })
    @JoinColumn()
    fileAssignment: FileAssignment

}