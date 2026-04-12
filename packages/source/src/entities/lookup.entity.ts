import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('lookup')
export class LookupEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  lookupid: number;

  @Column({ type: 'int', unsigned: true })
  entityId: number;

  @Column({ type: 'varchar', length: 255 })
  entityName: string;

  @Column({ type: 'json', nullable: true })
  entityJson: any;

  @Column({ type: 'varchar', length: 500, nullable: true })
  remarks: string;
}
