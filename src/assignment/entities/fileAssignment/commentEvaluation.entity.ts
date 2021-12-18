import { AdminUser } from "src/adminUser/AdminUser.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { SubmittedAssignment } from "./SubmittedAssignment.entity";

@Entity()
export class CommentEvaluation {

    @PrimaryGeneratedColumn()
    id: string

    @CreateDateColumn()
    createdAt: Date

    @CreateDateColumn()
    updatedAt: Date

    @Column()
    content: string

    @ManyToOne(() => AdminUser, (adminUser) => adminUser.commentEvaluations, {
        onDelete: "CASCADE"
    })
    @JoinColumn()
    createdBy: AdminUser

    @ManyToOne(() => SubmittedAssignment, (submittedAssignment) => submittedAssignment.comments)
    @JoinColumn()
    submitted: SubmittedAssignment
}