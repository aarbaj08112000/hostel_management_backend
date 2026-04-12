import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

enum SILENT {
  YES = 'Yes',
  NO = 'No',
}
enum STATUS {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
}

@Entity('mod_push_notify_template')
export class PushNotifyTemplateEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  templateTitle: string;

  @Column({ type: 'varchar', length: 255 })
  templateCode: string;

  @Column({ type: 'varchar', nullable: true, length: 50 })
  title: string;

  @Column({ type: 'text', nullable: true })
  message: string;

  @Column({ type: 'varchar', nullable: true, length: 255 })
  sound: string;

  @Column({ type: 'int', nullable: true })
  badge: number;

  @Column({ type: 'varchar', nullable: true, length: 255 })
  image: string;

  @Column({ type: 'varchar', nullable: true, length: 10 })
  color: string;

  @Column({ type: 'enum', enum: SILENT, default: SILENT.NO })
  silent: SILENT;

  @Column({ type: 'varchar', nullable: true, length: 50 })
  priority: string;

  @Column({ type: 'varchar', nullable: true, length: 255 })
  collapseKey: string;

  @Column({ type: 'int', nullable: true })
  sendInterval: number;

  @Column({ type: 'int', nullable: true })
  expireInterval: number;

  @Column({ type: 'json', nullable: true })
  varsJson: JSON;

  @Column({ type: 'enum', enum: STATUS, default: STATUS.ACTIVE })
  status: STATUS;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
