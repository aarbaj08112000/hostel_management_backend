import { OnModuleInit } from '@nestjs/common';
import { ElasticService } from './elastic.service';
import { CitGeneralLibrary } from '@repo/source/utilities/cit-general-library';
import { CallingEmailExecution } from './email-execution.service';
export declare class GearmanWorkerService implements OnModuleInit {
    private readonly elasticService;
    private readonly callingEmailExecution;
    private worker;
    protected readonly general: CitGeneralLibrary;
    constructor(elasticService: ElasticService, callingEmailExecution: CallingEmailExecution);
    onModuleInit(): boolean;
}
//# sourceMappingURL=gearman.worker.service.d.ts.map