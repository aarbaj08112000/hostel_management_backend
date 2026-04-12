import { Repository, DataSource } from 'typeorm';
import { SettingEntity } from '../entities/setting.entity';
export declare class ApiService {
    protected dataSource: DataSource;
    protected settingEntity: Repository<SettingEntity>;
    protected readonly log: any;
    constructor(dataSource: DataSource, settingEntity: Repository<SettingEntity>);
    getHello(): string;
    syncSettings(): Promise<any>;
}
//# sourceMappingURL=api.service.d.ts.map