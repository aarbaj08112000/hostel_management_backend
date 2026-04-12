import { Repository } from 'typeorm';
import { LookupEntity } from '@repo/source/entities/lookup.entity';
export declare class GetLookupData {
    private readonly lookupEntity;
    constructor(lookupEntity: Repository<LookupEntity>);
    getLkpData(inputParams: any): Promise<{
        settings: {
            status: number;
            success: number;
            message: string;
            count: number;
            per_page: number;
            curr_page: number;
            last_page: number;
            prev_page: boolean;
            next_page: boolean;
        };
        data: LookupEntity[];
    } | {
        settings: {
            status: number;
            success: number;
            message: any;
            count?: undefined;
            per_page?: undefined;
            curr_page?: undefined;
            last_page?: undefined;
            prev_page?: undefined;
            next_page?: undefined;
        };
        data: {};
    }>;
}
//# sourceMappingURL=fetch_lkp_data.service.d.ts.map