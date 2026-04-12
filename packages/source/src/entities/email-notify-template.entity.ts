import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

enum STATUS {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
}

@Entity('mod_email_notify_template')
export class EmailNotifyTemplateEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  emailTitle: string;

  @Column({ type: 'varchar', length: 255 })
  emailCode: string;

  @Column({ type: 'varchar', nullable: true, length: 255 })
  fromName: string;

  @Column({ type: 'varchar', nullable: true, length: 255 })
  fromEmail: string;

  @Column({ type: 'varchar', nullable: true, length: 255 })
  replyToName: string;

  @Column({ type: 'varchar', nullable: true, length: 255 })
  replyToEmail: string;

  @Column({ type: 'varchar', nullable: true, length: 255 })
  ccEmail: string;

  @Column({ type: 'varchar', nullable: true, length: 255 })
  bccEmail: string;

  @Column({ type: 'varchar', nullable: true, length: 255 })
  emailSubject: string;

  @Column({ type: 'text', nullable: true })
  emailMessage: string;

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
