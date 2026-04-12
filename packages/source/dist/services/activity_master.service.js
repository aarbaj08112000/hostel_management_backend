"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ActivityMasterService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityMasterService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const logger_handler_1 = require("@repo/source/utilities/logger-handler");
const typeorm_2 = require("typeorm");
const response_library_1 = require("@repo/source/utilities/response-library");
const activity_master_entity_1 = require("@repo/source/entities/activity-master.entity");
const base_service_1 = require("@repo/source/services/base.service");
const custom = __importStar(require("@repo/source/utilities/custom-helper"));
const _ = __importStar(require("lodash"));
let ActivityMasterService = ActivityMasterService_1 = class ActivityMasterService extends base_service_1.BaseService {
    log = new logger_handler_1.LoggerHandler(ActivityMasterService_1.name).getInstance();
    inputParams = {};
    blockResult;
    settingsParams;
    singleKeys = [];
    requestObj = {
        user: {},
    };
    dataSource;
    response;
    activityMasterEntityRepo;
    constructor() {
        super();
        this.singleKeys = [
            'custom_unique_condition',
            'insert_activity_master_data',
            'update_activity_master_data',
            'deleted_activity_master',
        ];
        this.moduleName = 'activity_master';
        this.moduleAPI = '';
        this.serviceConfig = {
            module_name: 'activity_master',
            table_name: 'activity_master',
            table_alias: 'am',
            primary_key: 'id',
            primary_alias: 'am_id',
            unique_fields: {
                type: 'and',
                fields: {
                    code: 'code',
                },
                message: 'Record already exists with this Activity Code',
            },
            expRefer: {},
            topRefer: {},
        };
    }
    async startActivityMasterUpdate(reqObject, reqParams) {
        let outputResponse = {};
        try {
            this.requestObj = reqObject;
            this.inputParams = reqParams;
            this.setModuleAPI('update');
            let inputParams = reqParams;
            inputParams = await this.customUniqueCondition(inputParams);
            if (inputParams.unique_status === 1) {
                outputResponse = this.activityMasterUniqueFailure(inputParams);
            }
            else {
                inputParams = await this.updateActivityMasterData(inputParams);
                if (!_.isEmpty(inputParams.update_activity_master_data)) {
                    outputResponse = this.activityMasterFinishSuccess(inputParams, 'Activity Updated successfully.');
                }
                else {
                    outputResponse = this.activityMasterFinishFailure(inputParams);
                }
            }
        }
        catch (err) {
            this.log.error('API Error >> activity_master_update >>', err);
        }
        return outputResponse;
    }
    async DeleteActivityMaster(id) {
        let outputResponse = {};
        try {
            this.setModuleAPI('delete');
            const inputParams = await this.deleteActivityMasterData(id);
            if (inputParams.deleted_activity_master) {
                outputResponse = this.activityMasterFinishSuccess(inputParams, inputParams.message);
            }
            else {
                outputResponse = this.activityMasterFinishFailure(inputParams);
            }
        }
        catch (err) {
            this.log.error('API Error >> activity_master_delete >>', err);
        }
        return outputResponse;
    }
    async deleteActivityMasterData(id) {
        try {
            const deleteResult = await this.activityMasterEntityRepo.delete({ id });
            if (deleteResult.affected === 0) {
                return { success: 0, message: 'No Activity found.' };
            }
            return {
                success: 1,
                message: 'Activity Deleted Successfully.',
                deleted_activity_master: deleteResult.affected,
            };
        }
        catch (err) {
            return { success: 0, message: err.message };
        }
    }
    async updateActivityMasterData(inputParams) {
        this.blockResult = {};
        try {
            const queryColumns = {};
            if ('name' in inputParams) {
                queryColumns.name = inputParams.name;
            }
            if ('template' in inputParams) {
                queryColumns.template = inputParams.template;
            }
            if ('params' in inputParams) {
                const val = inputParams.params;
                queryColumns.params =
                    typeof val === 'object' ? JSON.stringify(val) : String(val);
            }
            if ('type' in inputParams) {
                queryColumns.type = inputParams.type;
            }
            if ('status' in inputParams) {
                queryColumns.status = inputParams.status;
            }
            if ('updated_by' in inputParams) {
                queryColumns.updatedBy = inputParams.updated_by;
            }
            queryColumns.updatedDate = () => 'NOW()';
            const queryObject = this.activityMasterEntityRepo
                .createQueryBuilder()
                .update(activity_master_entity_1.ActivityMasterEntity)
                .set(queryColumns);
            if (!custom.isEmpty(inputParams.id)) {
                queryObject.andWhere('id = :id', { id: inputParams.id });
            }
            const res = await queryObject.execute();
            const data = {
                affected_rows: res.affected,
            };
            const success = 1;
            const message = 'Record(s) updated.';
            const queryResult = {
                success,
                message,
                data,
            };
            this.blockResult = queryResult;
        }
        catch (err) {
            this.blockResult.success = 0;
            this.blockResult.message = err;
            this.blockResult.data = [];
        }
        inputParams.update_activity_master_data = this.blockResult.data;
        inputParams = this.response.assignSingleRecord(inputParams, this.blockResult.data);
        return inputParams;
    }
    async startActivityMasterAdd(reqObject, reqParams) {
        let outputResponse = {};
        try {
            this.requestObj = reqObject;
            this.inputParams = reqParams;
            this.setModuleAPI('add');
            let inputParams = reqParams;
            inputParams = await this.customUniqueCondition(inputParams);
            if (inputParams.unique_status === 1) {
                outputResponse = this.activityMasterUniqueFailure(inputParams);
            }
            else {
                inputParams = await this.insertActivityMasterData(inputParams);
                if (!_.isEmpty(inputParams.insert_activity_master_data)) {
                    outputResponse = this.activityMasterFinishSuccess(inputParams, 'Activity Added successfully.');
                }
                else {
                    outputResponse = this.activityMasterFinishFailure(inputParams);
                }
            }
        }
        catch (err) {
            this.log.error('API Error >> activity_master_add >>', err);
        }
        return outputResponse;
    }
    async customUniqueCondition(inputParams) {
        let formatData = {};
        try {
            const result = await this.checkUniqueCondition(inputParams);
            formatData = this.response.assignFunctionResponse(result);
            inputParams.custom_unique_condition = formatData;
            inputParams = this.response.assignSingleRecord(inputParams, formatData);
        }
        catch (err) {
            this.log.error(err);
        }
        return inputParams;
    }
    activityMasterUniqueFailure(inputParams) {
        const settingFields = {
            status: 200,
            success: 0,
            message: custom.lang('Record already exists with this Activity Code'),
            fields: [],
        };
        return this.response.outputResponse({
            settings: settingFields,
            data: inputParams,
        }, {
            name: 'activity_master_add',
        });
    }
    async insertActivityMasterData(inputParams) {
        this.blockResult = {};
        try {
            const queryColumns = {};
            if ('code' in inputParams) {
                queryColumns.code = inputParams.code;
            }
            if ('name' in inputParams) {
                queryColumns.name = inputParams.name;
            }
            if ('template' in inputParams) {
                queryColumns.template = inputParams.template;
            }
            if ('params' in inputParams) {
                const val = inputParams.params;
                queryColumns.params =
                    typeof val === 'object' ? JSON.stringify(val) : String(val);
            }
            if ('type' in inputParams) {
                queryColumns.type = inputParams.type;
            }
            if ('status' in inputParams) {
                queryColumns.status = inputParams.status;
            }
            if ('added_by' in inputParams) {
                queryColumns.addedBy = inputParams.added_by;
            }
            queryColumns.addedDate = () => 'NOW()';
            const queryObject = this.activityMasterEntityRepo;
            const res = await queryObject.insert(queryColumns);
            const data = {
                insert_id: res.raw.insertId,
            };
            const success = 1;
            const message = 'Activity Added Successfully.';
            const queryResult = {
                success,
                message,
                data,
            };
            this.blockResult = queryResult;
        }
        catch (err) {
            this.blockResult.success = 0;
            this.blockResult.message = err;
            this.blockResult.data = [];
        }
        inputParams.insert_activity_master_data = this.blockResult.data;
        inputParams = this.response.assignSingleRecord(inputParams, this.blockResult.data);
        return inputParams;
    }
    async activityMasterFinishSuccess(inputParams, message) {
        const settingFields = {
            status: 200,
            success: 1,
            message: message,
            fields: [],
        };
        settingFields.fields = ['insert_id', 'insert_activity_master_data'];
        const outputKeys = ['insert_activity_master_data'];
        const outputAliases = {
            insert_id: 'id',
        };
        const outputObjects = ['insert_activity_master_data'];
        const outputData = {};
        outputData.settings = settingFields;
        outputData.data = inputParams;
        const funcData = {};
        funcData.name = 'activity_master_add';
        funcData.output_keys = outputKeys;
        funcData.output_alias = outputAliases;
        funcData.output_objects = outputObjects;
        funcData.single_keys = this.singleKeys;
        return this.response.outputResponse(outputData, funcData);
    }
    activityMasterFinishFailure(inputParams) {
        const settingFields = {
            status: 200,
            success: 0,
            message: custom.lang('Something went wrong, Please try again.'),
            fields: [],
        };
        return this.response.outputResponse({
            settings: settingFields,
            data: inputParams,
        }, {
            name: 'activity_master_add',
        });
    }
};
exports.ActivityMasterService = ActivityMasterService;
__decorate([
    (0, typeorm_1.InjectDataSource)(),
    __metadata("design:type", typeorm_2.DataSource)
], ActivityMasterService.prototype, "dataSource", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", response_library_1.ResponseLibrary)
], ActivityMasterService.prototype, "response", void 0);
__decorate([
    (0, typeorm_1.InjectRepository)(activity_master_entity_1.ActivityMasterEntity),
    __metadata("design:type", typeorm_2.Repository)
], ActivityMasterService.prototype, "activityMasterEntityRepo", void 0);
exports.ActivityMasterService = ActivityMasterService = ActivityMasterService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ActivityMasterService);
//# sourceMappingURL=activity_master.service.js.map