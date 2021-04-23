/* eslint-disable @typescript-eslint/no-unused-vars */
import { BaseEntityWithCreatedBy } from 'src/common/Entity/base.entity';
import { Role } from 'src/permission/entities/Role.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class AdminUser extends BaseEntityWithCreatedBy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @ManyToOne(() => Role, (role) => role.adminUser, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'role',
  })
  role: Role
}
