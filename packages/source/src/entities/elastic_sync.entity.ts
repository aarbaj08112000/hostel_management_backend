import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserBase } from './base-user.entity';

enum STATUS {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
}
enum SEARCHABLE {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
}

@Entity('sync_elastic_entity')
export class SyncElasticEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  iSyncElasticId: number;

  @Column({ type: 'varchar', nullable: true, length: 255 })
  vEntity: number;

  @Column({ type: 'varchar', length: 255 })
  vMySqlEntity: string;

  @Column({ type: 'varchar', nullable: true, length: 255 })
  vMySqlEntityType: string;

  @Column({ type: 'varchar', nullable: true, length: 255 })
  vUniqueKey: string;

  @Column({ type: 'varchar', length: 255 })
  vUniqueIndex: string;

  @Column({ type: 'varchar', nullable: true, length: 255 })
  vEntityType: string;

  @Column({ type: 'varchar', nullable: true, length: 255 })
  vEntityRegex: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dLastSyncTime: Date;

  @Column({ type: 'int', nullable: false, default: '0' })
  iBulkUploadLimit: number;

  @Column({
    type: 'enum',
    nullable: true,
    enum: STATUS,
    default: STATUS.ACTIVE,
  })
  eStatus: STATUS;

  @Column({
    type: 'enum',
    nullable: true,
    enum: SEARCHABLE,
    default: SEARCHABLE.ACTIVE,
  })
  eIsSearchable: SEARCHABLE;

  @Column({
    type: 'enum',
    nullable: true,
    enum: SEARCHABLE,
    default: SEARCHABLE.ACTIVE,
  })
  eIsEnabledForSearch: SEARCHABLE;
}

enum IS_SEARCHABLE {
  YES = 'Yes',
  NO = 'No',
}
enum IS_ENABLED_FOR_SEARCH {
  YES = 'Yes',
  NO = 'No',
}

@Entity('sync_elastic_entity_user')
export class SyncElasticEntityUser {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', nullable: true, length: 100 })
  entityName: string;

  @Column({ type: 'varchar', nullable: true, length: 100 })
  entityType: string;

  @Column({ type: 'varchar', nullable: true, length: 255 })
  entityRegex: string;

  @Column({ type: 'varchar', nullable: true, length: 100 })
  sqlEntityName: string;

  @Column({ type: 'varchar', nullable: true, length: 50 })
  sqlEntityType: string;

  @Column({ type: 'varchar', nullable: true, length: 50 })
  uniqueKey: string;

  @Column({ type: 'varchar', nullable: true, length: 50 })
  uniqueIndex: string;

  @Column({ type: 'datetime', nullable: true })
  lastSyncTime: Date;

  @Column({ type: 'smallint', nullable: true })
  bulkUploadLimit: number;

  @Column({
    type: 'enum',
    nullable: true,
    enum: IS_SEARCHABLE,
    default: IS_SEARCHABLE.YES,
  })
  eIsSearchable: IS_SEARCHABLE;

  @Column({
    type: 'enum',
    nullable: true,
    enum: IS_ENABLED_FOR_SEARCH,
    default: IS_ENABLED_FOR_SEARCH.YES,
  })
  eIsEnabledForSearch: IS_ENABLED_FOR_SEARCH;

  @Column({
    type: 'enum',
    nullable: true,
    enum: STATUS,
    default: STATUS.ACTIVE,
  })
  status: STATUS;

  @Column({ type: 'varchar', nullable: true, length: 255 })
  addedBy: string;

  @Column({ type: 'varchar', nullable: true, length: 255 })
  updatedBy: string;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
