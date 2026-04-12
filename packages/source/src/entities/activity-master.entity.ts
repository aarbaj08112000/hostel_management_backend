import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { UserBase } from './base-user.entity';

enum STATUS {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
}
enum TYPE {
  USER = 'User',
}

@Entity('activity_master')
export class ActivityMasterEntity extends UserBase {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', unique: true })
  code: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'text', nullable: true })
  template?: string;

  @Column({ type: 'text', nullable: true })
  params?: string;

  @Column({ type: 'enum', enum: TYPE })
  type: 'User';

  @Column({ type: 'enum', nullable: true, enum: STATUS })
  status: STATUS;
}
