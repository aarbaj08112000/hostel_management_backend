import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('activity_log')
export class ActivityLogEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'int' })
  activityMasterId: number;

  @Column({ type: 'text', nullable: true })
  valueJson?: string;

  @Column({ type: 'varchar', length: 255 })
  moduleCode: string;

  @Column({ type: 'int', nullable: true })
  requestId: number;

  @Column({ type: 'int', nullable: true, select: false })
  carId?: number;

  @Column({ type: 'int', nullable: true })
  addedBy: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  addedDate: Date;
}
