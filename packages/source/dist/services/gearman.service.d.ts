import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
export declare class GearmanService implements OnModuleInit, OnModuleDestroy {
    private client;
    onModuleInit(): void;
    onModuleDestroy(): void;
    submitJob(jobName: string, workload: any): Promise<string>;
}
//# sourceMappingURL=gearman.service.d.ts.map