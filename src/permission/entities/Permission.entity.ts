import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PermissionSet {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  course: string;

  @Column()
  user: string;

  @Column()
  blog: string;

  @Column()
  instructor: string;

  @Column()
  permission: string;

  @Column()
  notification: string;
}
