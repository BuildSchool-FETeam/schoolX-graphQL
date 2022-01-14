import { ClientUser } from 'src/clientUser/entities/ClientUser.entity'
import { BaseEntity } from 'src/common/entity/base.entity'
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { FileAssignment } from './fileAssignment.entity'
import { SubmittedAssignment } from './SubmittedAssignment.entity'

@Entity()
export class GroupAssignment{
  @PrimaryGeneratedColumn()
  id: string

  @Column({ nullable: true })
  title: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
  
  @ManyToOne(() => ClientUser, (user) => user.submittedGroupAssignments)
  @JoinColumn()
  user: ClientUser

  @Column({ default: 0 })
  previousScore?: number

  @OneToMany(() => SubmittedAssignment, (submitted) => submitted.group)
  submitteds: SubmittedAssignment[]

  @ManyToOne(
    () => FileAssignment,
    (fileAssignment) => fileAssignment.submittedGroupAssignments,
    {
      onDelete: 'CASCADE',
    }
  )
  @JoinColumn()
  fileAssignment: FileAssignment

  @Column({ default: true })
  isUpdated: boolean
}
