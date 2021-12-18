import { ClientUser } from "src/clientUser/entities/ClientUser.entity";
import { UserComment } from "src/comment/entities/UserComment.entity";
import { BaseEntity } from "src/common/entity/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { CommentEvaluation } from "./commentEvaluation.entity";
import { FileAssignment } from "./fileAssignment.entity";
import { GroupAssignment } from "./groupAssignment.entity";

@Entity()
export class SubmittedAssignment extends BaseEntity {

    @Column({nullable: true})
    description: string

    @Column()
    order: number
    
    @Column({nullable: true})
    fileUrl: string

    @Column({nullable: true})
    reApply?: boolean

    @OneToMany(() => CommentEvaluation, (comment) => comment.submitted)
    comments: CommentEvaluation[]

    @ManyToOne(() => GroupAssignment, (group) => group.submitteds, {
        onDelete: 'CASCADE'
    })
    @JoinColumn()
    group: GroupAssignment
}