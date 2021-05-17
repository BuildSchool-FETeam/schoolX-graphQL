import { AdminUser } from 'src/adminUser/AdminUser.entity';
import { BaseEntity } from 'src/common/entity/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class AdminNotification extends BaseEntity {
  @ManyToOne(() => AdminUser, { onDelete: 'CASCADE' })
  createdBy: AdminUser;

  @Column()
  content: string;

  @Column()
  recipientByAdminIds: string;
}
