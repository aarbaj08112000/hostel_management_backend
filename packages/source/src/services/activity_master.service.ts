interface AuthObject {
  user: any;
}
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { LoggerHandler } from '@repo/source/utilities/logger-handler';
import { BlockResultDto } from '@repo/source/common/dto/common.dto';
import { SettingsParamsDto } from '@repo/source/common/dto/common.dto';
import { DataSource, Repository } from 'typeorm';
import { ResponseLibrary } from '@repo/source/utilities/response-library';
import { ActivityMasterEntity } from '@repo/source/entities/activity-master.entity';
import { BaseService } from '@repo/source/services/base.service';
import * as custom from '@repo/source/utilities/custom-helper';
import * as _ from 'lodash';
@Injectable()
export class ActivityMasterService extends BaseService {
  protected readonly log = new LoggerHandler(
    ActivityMasterService.name,
  ).getInstance();
  protected inputParams: object = {};
  protected blockResult: BlockResultDto;
  protected settingsParams: SettingsParamsDto;
  protected singleKeys: any[] = [];
  protected requestObj: AuthObject = {
    user: {},
  };

  @InjectDataSource()
  protected dataSource: DataSource;
  @Inject()
  protected readonly response: ResponseLibrary;
  @InjectRepository(ActivityMasterEntity)
  protected activityMasterEntityRepo: Repository<ActivityMasterEntity>;

  /**
   * constructor method is used to set preferences while service object initialization.
   */
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
      } else {
        inputParams = await this.updateActivityMasterData(inputParams);
        if (!_.isEmpty(inputParams.update_activity_master_data)) {
          outputResponse = this.activityMasterFinishSuccess(
            inputParams,
            'Activity Updated successfully.',
          );
        } else {
          outputResponse = this.activityMasterFinishFailure(inputParams);
        }
      }
    } catch (err) {
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
        // let job_data = {
        //   job_function: 'delete_elastic_data',
        //   job_params: {
        //     module: 'nest_local_activity',
        //     data: id
        //   },
        //   path: 'api/master/delete-data'
        // };
        // await this.general.submitGearmanJob(job_data);
        outputResponse = this.activityMasterFinishSuccess(
          inputParams,
          inputParams.message,
        );
      } else {
        outputResponse = this.activityMasterFinishFailure(inputParams);
      }
    } catch (err) {
      this.log.error('API Error >> activity_master_delete >>', err);
    }
    return outputResponse;
  }

  async deleteActivityMasterData(id: any) {
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
    } catch (err) {
      return { success: 0, message: err.message };
    }
  }
  async updateActivityMasterData(inputParams: any) {
    this.blockResult = {};
    try {
      const queryColumns: any = {};

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
        .update(ActivityMasterEntity)
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
    } catch (err) {
      this.blockResult.success = 0;
      this.blockResult.message = err;
      this.blockResult.data = [];
    }
    inputParams.update_activity_master_data = this.blockResult.data;
    inputParams = this.response.assignSingleRecord(
      inputParams,
      this.blockResult.data,
    );

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
      } else {
        inputParams = await this.insertActivityMasterData(inputParams);
        if (!_.isEmpty(inputParams.insert_activity_master_data)) {
          outputResponse = this.activityMasterFinishSuccess(
            inputParams,
            'Activity Added successfully.',
          );
        } else {
          outputResponse = this.activityMasterFinishFailure(inputParams);
        }
      }
    } catch (err) {
      this.log.error('API Error >> activity_master_add >>', err);
    }
    return outputResponse;
  }

  async customUniqueCondition(inputParams: any) {
    let formatData: any = {};
    try {
      //@ts-ignore
      const result = await this.checkUniqueCondition(inputParams);

      formatData = this.response.assignFunctionResponse(result);
      inputParams.custom_unique_condition = formatData;

      inputParams = this.response.assignSingleRecord(inputParams, formatData);
    } catch (err) {
      this.log.error(err);
    }
    return inputParams;
  }

  activityMasterUniqueFailure(inputParams: any) {
    const settingFields = {
      status: 200,
      success: 0,
      message: custom.lang('Record already exists with this Activity Code'),
      fields: [],
    };
    return this.response.outputResponse(
      {
        settings: settingFields,
        data: inputParams,
      },
      {
        name: 'activity_master_add',
      },
    );
  }

  async insertActivityMasterData(inputParams: any) {
    this.blockResult = {};
    try {
      const queryColumns: any = {};
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
    } catch (err) {
      this.blockResult.success = 0;
      this.blockResult.message = err;
      this.blockResult.data = [];
    }
    inputParams.insert_activity_master_data = this.blockResult.data;
    inputParams = this.response.assignSingleRecord(
      inputParams,
      this.blockResult.data,
    );
    return inputParams;
  }

  async activityMasterFinishSuccess(inputParams: any, message: string) {
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

    const outputData: any = {};
    outputData.settings = settingFields;
    outputData.data = inputParams;

    const funcData: any = {};
    funcData.name = 'activity_master_add';

    funcData.output_keys = outputKeys;
    funcData.output_alias = outputAliases;
    funcData.output_objects = outputObjects;
    funcData.single_keys = this.singleKeys;
    // let job_data = {
    //   job_function: 'sync_elastic_data',
    //   job_params: {
    //     module: 'activity_list',
    //     data: inputParams.insert_id ? inputParams.insert_id : inputParams.id
    //   },
    // };
    // await this.general.submitGearmanJob(job_data);
    return this.response.outputResponse(outputData, funcData);
  }

  activityMasterFinishFailure(inputParams: any) {
    const settingFields = {
      status: 200,
      success: 0,
      message: custom.lang('Something went wrong, Please try again.'),
      fields: [],
    };
    return this.response.outputResponse(
      {
        settings: settingFields,
        data: inputParams,
      },
      {
        name: 'activity_master_add',
      },
    );
  }
}
