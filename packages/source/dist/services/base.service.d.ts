import { EntityManager } from 'typeorm';
import { CitGeneralLibrary } from '../utilities/cit-general-library';
import { ModuleService } from './module.service';
export declare class BaseService {
    protected readonly log: any;
    protected readonly entityManager: EntityManager;
    protected readonly moduleService: ModuleService;
    protected readonly general: CitGeneralLibrary;
    protected moduleName: string;
    protected moduleAPI: string;
    protected serviceConfig: any;
    protected listConfiguration: any;
    protected formConfiguration: any;
    protected optionsConfiguration: any;
    setModuleAPI(api: string): void;
    checkUniqueCondition(inputParams: any): Promise<{
        unique_status: number;
        unique_message: string;
    }>;
    listFieldFormatter(val: any, row: any, opts: any): Promise<any>;
    detailFieldFormatter(val: any, row: any, opts: any): Promise<any>;
    formFieldFormatter(val: any, row: any, opts: any): Promise<any>;
    getCallbackObject(callback: string): any;
    executeQuery(rawQuery: string, bindings: any[]): Promise<{
        success: any;
        message: any;
        data: any;
    }>;
    executeSelect(queryConfig: any): Promise<{
        success: any;
        message: any;
        data: any;
    }>;
    executeInsert(queryConfig: any): Promise<{
        success: any;
        message: any;
        data: any;
    }>;
    executeUpdate(queryConfig: any): Promise<{
        success: any;
        message: any;
        data: any;
    }>;
    executeDelete(queryConfig: any): Promise<{
        success: any;
        message: any;
        data: any;
    }>;
    addJoinTables(queryObject: any, joinDetails: any[]): void;
    addSelectFields(queryObject: any, fields: any[]): void;
    addWhereFields(queryObject: any, fields: any[], type: string): void;
}
//# sourceMappingURL=base.service.d.ts.map