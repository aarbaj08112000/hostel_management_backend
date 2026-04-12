interface AuthObject {
    user: any;
}
import { BlockResultDto } from '@repo/source/common/dto/common.dto';
import { SettingsParamsDto } from '@repo/source/common/dto/common.dto';
import { DataSource, Repository } from 'typeorm';
import { ResponseLibrary } from '@repo/source/utilities/response-library';
import { ActivityMasterEntity } from '@repo/source/entities/activity-master.entity';
import { BaseService } from '@repo/source/services/base.service';
export declare class ActivityMasterService extends BaseService {
    protected readonly log: any;
    protected inputParams: object;
    protected blockResult: BlockResultDto;
    protected settingsParams: SettingsParamsDto;
    protected singleKeys: any[];
    protected requestObj: AuthObject;
    protected dataSource: DataSource;
    protected readonly response: ResponseLibrary;
    protected activityMasterEntityRepo: Repository<ActivityMasterEntity>;
    constructor();
    startActivityMasterUpdate(reqObject: any, reqParams: any): Promise<{}>;
    DeleteActivityMaster(id: any): Promise<{}>;
    deleteActivityMasterData(id: any): Promise<{
        success: number;
        message: string;
        deleted_activity_master: number;
    } | {
        success: number;
        message: any;
        deleted_activity_master?: undefined;
    }>;
    updateActivityMasterData(inputParams: any): Promise<any>;
    startActivityMasterAdd(reqObject: any, reqParams: any): Promise<{}>;
    customUniqueCondition(inputParams: any): Promise<any>;
    activityMasterUniqueFailure(inputParams: any): any;
    insertActivityMasterData(inputParams: any): Promise<any>;
    activityMasterFinishSuccess(inputParams: any, message: string): Promise<any>;
    activityMasterFinishFailure(inputParams: any): any;
}
export {};
//# sourceMappingURL=activity_master.service.d.ts.map