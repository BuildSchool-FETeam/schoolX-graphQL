import { BaseEntity } from "src/common/entity/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
<<<<<<< HEAD
import { FileAssignment } from "./fileAssignment.entity";
=======
import { EvaluationComment } from "./evaluationComment.entity";
>>>>>>> 8383a0d (resolve)
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

<<<<<<< HEAD
    @OneToMany(() => UserComment, (userComment) => userComment.submittedAssignment)
    comments: UserComment[]
=======
    @OneToMany(() => EvaluationComment, (comment) => comment.submitted)
    comments: EvaluationComment[]
>>>>>>> 8383a0d (resolve)

    @ManyToOne(() => GroupAssignment, (group) => group.submitteds, {
        onDelete: 'CASCADE'
    })
    @JoinColumn()
    group: GroupAssignment

    @Column({default: false})
    hasSeen: boolean;
}