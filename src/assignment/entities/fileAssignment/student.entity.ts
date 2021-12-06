import { ClientUser } from "src/clientUser/entities/ClientUser.entity";
import { UserComment } from "src/comment/entities/UserComment.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { FileAssignment } from "./fileAssignment.entity";
import { Submit } from "./Submit.entity";

@Entity()
export class Student {
    @PrimaryGeneratedColumn()
    id: string

    @OneToMany(() => UserComment, (userComment) => userComment.student)
    comments: UserComment[]

    @OneToOne(() => ClientUser)
    @JoinColumn()
    user: ClientUser

    @Column({nullable: true})
    reApply?: boolean

    @OneToMany(() => Submit, (submit) => submit.student)
    submits: Submit[]

    @ManyToOne(() => FileAssignment, (fileAssignment) => fileAssignment.students, {
        onDelete: "CASCADE"
    })
    @JoinColumn()
    fileAssignment: FileAssignment
}