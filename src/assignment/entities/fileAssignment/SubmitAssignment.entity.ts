import { ClientUser } from "src/clientUser/entities/ClientUser.entity";
import { UserComment } from "src/comment/entities/UserComment.entity";
import { BaseEntity } from "src/common/entity/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { FileAssignment } from "./fileAssignment.entity";

@Entity()
export class SubmittedAssignment extends BaseEntity {

    @Column({nullable: true})
    description: string

    @Column()
    order: number
    
    @Column()
    fileUrl: string

    @Column({nullable: true})
    reApply?: boolean

    @ManyToOne(() => ClientUser)
    @JoinColumn()
    user: ClientUser

    @OneToMany(() => UserComment, (userComment) => userComment.submittedAssignment)
    comments: UserComment[]

    @ManyToOne(() => FileAssignment, (fileAssignment) => fileAssignment.submitteds, {
        onDelete: 'CASCADE'
    })
    @JoinColumn()
    fileAssignment: FileAssignment
}