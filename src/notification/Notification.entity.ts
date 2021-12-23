import { AdminUser } from 'src/adminUser/AdminUser.entity';
import { BaseEntity } from 'src/common/entity/base.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity()
export class AdminNotification {
  @PrimaryGeneratedColumn()
  id: string

  @Column()
  title: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(() => AdminUser, { onDelete: 'CASCADE' })
  createdBy: AdminUser

  @Column()
  content: string

  @Column()
  recipientByAdminIds: string
}
