import { ClientUser } from "src/clientUser/entities/ClientUser.entity";
import { UserComment } from "src/comment/entities/UserComment.entity";
import { BaseEntity } from "src/common/entity/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { FileAssignment } from "./fileAssignment.entity";
import { GroupAssignment } from "./groupAssignment.entity";

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

    @OneToMany(() => UserComment, (userComment) => userComment.submittedAssignment)
    comments: UserComment[]

    @ManyToOne(() => GroupAssignment, (group) => group.submitteds, {
        onDelete: 'CASCADE'
    })
    @JoinColumn()
    group: GroupAssignment
}