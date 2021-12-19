import { ClientUser } from "src/clientUser/entities/ClientUser.entity";
import { BaseEntity } from "src/common/entity/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { FileAssignment } from './fileAssignment.entity';
import { SubmittedAssignment } from './SubmittedAssignment.entity';

@Entity()
export class GroupAssignment extends BaseEntity {
  @ManyToOne(() => ClientUser, (user) => user.submittedGroupAssignments)
  @JoinColumn()
  user: ClientUser;

  @Column({ default: 0 })
  previousScore?: number;

  @OneToMany(() => SubmittedAssignment, (submitted) => submitted.group)
  submitteds: SubmittedAssignment[];

  @ManyToOne(
    () => FileAssignment,
    (fileAssignment) => fileAssignment.submittedGroupAssignments,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn()
  fileAssignment: FileAssignment;

  @Column({ default: true })
  isUpdated: boolean;
}