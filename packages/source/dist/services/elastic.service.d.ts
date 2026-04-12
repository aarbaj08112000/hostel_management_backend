import { Repository, DataSource } from 'typeorm';
import { SyncElasticEntity } from '@repo/source/entities/elastic_sync.entity';
import { CacheService } from './cache.service';
import { ConfigService } from '@nestjs/config';
export declare class ElasticService {
    protected readonly cacheService: CacheService;
    protected readonly configService: ConfigService;
    private readonly esClient;
    protected dataSource: DataSource;
    protected syncEntityRepo: Repository<SyncElasticEntity>;
    constructor(cacheService: CacheService, configService: ConfigService);
    search(index: string, query: any, from?: number, limit?: number, boosted?: string): Promise<import("@elastic/elasticsearch/lib/api/types").SearchHitsMetadata<unknown>>;
    searchGlobalData(index: string, query: any, fullRes?: any, is_front?: string): Promise<Record<string, import("@elastic/elasticsearch/lib/api/types").AggregationsAggregate> | import("@elastic/elasticsearch/lib/api/types").SearchHitsMetadata<unknown> | {
        statusCode: number;
        error: string;
    }>;
    deleteAllDocumentsFromIndices(index?: string): Promise<import("@elastic/elasticsearch/lib/api/types").DeleteByQueryResponse | {
        success: number;
        message: string;
    }>;
    getIndicesStartingWith(prefix: string): Promise<{
        data: import("@elastic/elasticsearch/lib/api/types").CatIndicesResponse;
        success: number;
    }>;
    getById(id: any, index: string, search_by?: any, getId?: string, source?: any): Promise<any>;
    syncElasticData(index?: string, id?: any, dev?: string): Promise<{}>;
    createSyncData(sync_data: any, view_data: any): Promise<{}>;
    insertActivityLogElasticData(index: string, data: any): Promise<string | import("@elastic/elasticsearch/lib/api/types").BulkResponse>;
    insertElasticData(index: string, data: any): Promise<string | import("@elastic/elasticsearch/lib/api/types").BulkResponse>;
    transalateQuery(index: string, query: any, from?: number, limit?: number): Promise<{
        query: any;
        _source: boolean;
        fields: any;
        sort: any;
        track_total_hits: boolean;
    }>;
    modifyQuery(query: any): any;
    updateElasticDocument(slug: string, index: string, search_by: string, newKey: string, newValue: any): Promise<{
        success: number;
        message: string;
    }>;
    getMapping(index: string): Promise<{
        dateFields: string[];
        mapping: any;
    }>;
    deleteDocument(index: string, docId: string): Promise<any>;
    getConfigItem(key: string): Promise<any>;
    chunkArray(array: any, chunkSize: any): any[];
    searchAggrregate(index: string, query: any, fullRes?: any, is_front?: string): Promise<Record<string, import("@elastic/elasticsearch/lib/api/types").AggregationsAggregate>>;
    checkMultipleIndexes(indices: string[]): Promise<Record<string, boolean>>;
    getDBIndexMapping(index: string): Promise<any>;
    buildElasticsearchSQLQuery(cleanedQueryParams: any, cleanedSortParams?: {
        [key: string]: any;
    }): string;
    buildCondition(key: any, operator: any, value: any): string;
}
//# sourceMappingURL=elastic.service.d.ts.map