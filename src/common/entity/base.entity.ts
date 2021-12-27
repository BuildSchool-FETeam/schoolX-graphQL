import { AdminUser } from 'src/adminUser/AdminUser.entity'
import {
  Column,
  CreateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  id: string

  @Column({ nullable: true })
  title: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

export abstract class BaseEntityUUID {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  title: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

export abstract class UserBaseEntityUUID {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
export abstract class BaseEntityWithCreatedBy {
  @ManyToOne(() => AdminUser, { onDelete: 'CASCADE' })
  createdBy: AdminUser
}
