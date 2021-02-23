/* eslint-disable @typescript-eslint/no-unused-vars */
import { Role } from 'src/permission/entities/Role.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class AdminUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToOne(() => Role)
  @JoinColumn({
    name: 'role'
  })
  role: Role;
}
