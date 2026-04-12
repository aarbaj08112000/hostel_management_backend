import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  InternalServerErrorException,
} from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';
import { Repository, DataSource } from 'typeorm';
import { SyncElasticEntity } from '@repo/source/entities/elastic_sync.entity';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import * as _ from 'lodash';
import { format } from 'date-fns';
import axios from 'axios';
import { re } from 'mathjs';
import { CacheService } from './cache.service';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class ElasticService {
  private readonly esClient: Client;
  @InjectDataSource()
  protected dataSource: DataSource;
  @InjectRepository(SyncElasticEntity)
  protected syncEntityRepo: Repository<SyncElasticEntity>;
  constructor(
    protected readonly cacheService: CacheService,
    protected readonly configService: ConfigService,
  ) {
    this.esClient = new Client({
      node: process.env.ELASTIC_HOST,
      tls: {
        rejectUnauthorized: false,
      },
      auth: {
        username: process.env.ELASTIC_USER,
        password: process.env.ELASTIC_AUTH,
      },
    });
  }
  async search(
    index: string,
    query: any,
    from?: number,
    limit?: number,
    boosted?: string,
  ) {
    const isIndexExist = await this.checkMultipleIndexes([index]);
    if (typeof boosted == 'undefined' || boosted == '' || boosted == null) {
      boosted = 'No';
    }
    if (!isIndexExist[index]) {
      throw new Error('No Data Found');
    }
    const { dateFields, mapping } = await this.getMapping(index);
    const elastic_limit = await this.getConfigItem('ELASTIC_REC_LIMIT');
    if (query?.is_admin == 'Yes') {
      const paramsArray: any = Object.values(query?.original_params);
      const filteredArray = paramsArray.filter((param) => {
        if (param.key && param.key.includes('custom_field_json')) {
          return true;
        }
        if (param.key) {
          return mapping.hasOwnProperty(param.key);
        }

        if (Array.isArray(param.keys)) {
          return param.keys.some((k) => mapping.hasOwnProperty(k));
        }

        return false;
      });
      query.original_params = Object.fromEntries(
        filteredArray.map((param, index) => [index, param]),
      );
      query.query = this.buildElasticsearchSQLQuery(
        query?.original_params,
        query?.original_order,
      );
      let translated_query = await this.transalateQuery(
        index,
        query,
        from,
        limit,
      );
      query = translated_query;
    }
    if (boosted == 'No') {
      if (dateFields.includes('added_date')) {
        if (!query.sort) {
          const newSort = {
            added_date: {
              order: 'desc',
            },
          };
          query = {
            ...query,
            sort: [newSort],
          };
        }
      }
    }
    try {
      let size;
      if (limit > 0) {
        size = limit;
      }
      if (typeof size == 'undefined') {
        size = elastic_limit;
      }
      const response = await this.esClient.search({
        index,
        body: query,
        from,
        size,
      });

      let data = response.hits.hits.map((hit) => {
        const formattedSource =
          hit._source && typeof hit._source === 'object'
            ? { ...hit._source }
            : {};
        dateFields.forEach((dateField) => {
          if (formattedSource[dateField]) {
            formattedSource[dateField + '_raw'] = formattedSource[dateField];
            formattedSource[dateField] = format(
              new Date(formattedSource[dateField]),
              'dd-MM-yyyy hh:mm a',
            );
          }
        });

        return {
          ...hit,
          _source: formattedSource,
        };
      });
      response.hits.hits = data;
      return response.hits;
    } catch (error) {
      throw new InternalServerErrorException(
        'failed to fetch data from Elasticsearch',
      );
    }
  }
  async searchGlobalData(
    index: string,
    query: any,
    fullRes?: any,
    is_front?: string,
  ) {
    let output = {};
    let server_name = await this.getConfigItem('ELASTIC_SERVER');
    server_name = server_name
      ? `NEST_${server_name.toUpperCase()}`
      : 'NEST_LOCAL';
    let index_mapping = index
      .split(',')
      .map((ind) => `${server_name.toLowerCase()}_${ind}`);
    try {
      const response = await this.esClient.search({
        index: index_mapping,
        body: query,
        highlight: {
          pre_tags: [''],
          post_tags: [''],
          fields: {
            '*': {},
          },
          require_field_match: false,
        },
      });
      if (fullRes == 'Yes') {
        return response.aggregations;
      }
      return response.hits;
    } catch (error) {
      console.log(error);
      if (error.meta && error.meta.statusCode === 404) {
        return {
          statusCode: 404,
          error: 'No data found for the given id.',
        };
      }
    }
  }
  async deleteAllDocumentsFromIndices(index?: string) {
    try {
      let server_name = await this.getConfigItem('ELASTIC_SERVER');
      server_name = server_name
        ? `NEST_${server_name.toUpperCase()}`
        : 'NEST_LOCAL';
      if (index != '' && index != null) {
        server_name = `${server_name}_${index}`;
      }
      let all_indexs = await this.getIndicesStartingWith(
        server_name.toLowerCase(),
      );
      let indexList = '';
      if (all_indexs.success === 1) {
        let index_mapping = all_indexs.data.map((item) => item.index);
        indexList = index_mapping.join(',');
      }
      if (indexList == '') {
        return {
          success: 0,
          message: 'No data to delete from index',
        };
      }
      const response = await this.esClient.deleteByQuery({
        index: indexList,
        body: {
          query: {
            match_all: {},
          },
        },
        refresh: true,
        conflicts: 'proceed',
      });

      return response;
    } catch (err) {
      console.log(err);
    }
  }
  async getIndicesStartingWith(prefix: string) {
    const result = await this.esClient.cat.indices({
      format: 'json',
      index: `${prefix}*`,
    });
    let success = 0;
    if (result.length > 0) {
      success = 1;
      return {
        data: result,
        success: success,
      };
    } else {
      return {
        data: [],
        success: success,
      };
    }
  }
  async getById(
    id: any,
    index: string,
    search_by?: any,
    getId?: string,
    source?: any,
  ): Promise<any> {
    const isIndexExist = await this.checkMultipleIndexes([index]);
    if (!isIndexExist[index]) {
      throw new Error('No Data Found');
    }
    let return_arr = {};
    try {
      const { dateFields, mapping } = await this.getMapping(index);

      let result;
      let type;

      if (search_by === 'slug' || search_by === 'entity_code') {
        switch (search_by) {
          case 'slug':
            type = 'car_slug';
            break;
          case 'entity_code':
            type = 'entity_code';
            break;
        }
        const searchBody = {
          query: {
            [typeof id === 'object' ? 'terms' : 'term']: {
              [type]: id,
            },
          },
        };
        if (source) {
          searchBody['_source'] = source;
        }
        result = await this.esClient.search({
          index: index,
          body: searchBody,
        });
        if (result.hits.total.value === 0) {
          throw new Error('No records found.');
          return {
            success: 0,
            message: 'No data found for the provided search criteria.',
          };
        }

        if (getId == 'Yes') {
          return result.hits.hits[0];
        }

        result = result.hits.hits.map((hit) => hit._source);
        if (typeof id == 'string') {
          result = result[0];
        }
      } else {
        result = await this.esClient.get({
          index: index,
          id: id,
        });
        if (!result.found) {
          throw new Error('No records found.');
          return { success: 0, message: `No document found with ID: ${id}.` };
        }

        result = result._source;
      }
      dateFields.forEach((dateField) => {
        if (result[dateField]) {
          result[dateField] = format(
            new Date(result[dateField]),
            'dd-MM-yyyy hh:mm a',
          );
        }
      });
      return result;
    } catch (error) {
      if (error.meta?.statusCode === 404) {
        throw new Error('No records found.');
        return { success: 0, message: `No document found with ID: ${id}.` };
      }
      throw new Error('No records found.');
      return { message: 'An error occurred while fetching the data.' };
    }
  }
  async syncElasticData(index?: string, id?: any, dev?: string) {
    let blockResult = {};
    let view_data = [];
    try {
      let queryObject: any = this.syncEntityRepo.createQueryBuilder('syn');
      if (typeof index != 'undefined' && index != '') {
        queryObject.where('vMySqlEntity = :value', { value: index });
      }
      const data = await queryObject.execute();
      if (!_.isArray(data) || _.isEmpty(data)) {
        throw new Error('No records found.');
      }
      let server_name = await this.getConfigItem('ELASTIC_SERVER');
      server_name = server_name
        ? `NEST_${server_name.toUpperCase()}`
        : 'NEST_LOCAL';
      let response = data.map((res) => {
        return {
          entity: res['syn_vMySqlEntity'],
          index: server_name.toLowerCase() + '_' + res['syn_vUniqueIndex'],
        };
      });
      if (Object.keys(data).length > 0) {
        for (const value of data) {
          let query = `select * from ${value.syn_vMySqlEntity}`;
          if (typeof index != 'undefined' && index != '') {
            if (typeof id != 'undefined' && id != '') {
              if (typeof id == 'object') {
                id = id.join("','");
              }
              query = query + `  where ${value.syn_vUniqueKey} in  ('${id}')`;
            }
          }
          const return_data = await this.dataSource.query(query);
          let view_response = await this.createSyncData(value, return_data);
          view_data.push(view_response);
        }
        if (view_data.length <= 0) {
          throw new Error('No View Data Found');
        }
      }
      const success = 1;
      const message = 'Records found.';
      const queryResult = {
        success,
        message,
        data: dev == 'Yes' ? view_data : response,
      };
      blockResult = queryResult;
    } catch (err) {
      console.log(err);
      blockResult['success'] = 0;
      blockResult['message'] = 'No Data Found';
      blockResult['data'] = [];
    }
    return blockResult;
  }
  async createSyncData(sync_data, view_data) {
    let final_obj_arr = {};
    let temp_data = [];
    try {
      if (
        Object.keys(view_data).length <= 0 ||
        typeof view_data == 'undefined'
      ) {
        throw new Error('No View Data Found');
      }
      let unique_key = sync_data.syn_vUniqueKey;
      let chunk_arr = this.chunkArray(
        view_data,
        sync_data.syn_iBulkUploadLimit ? sync_data.syn_iBulkUploadLimit : 100,
      );
      for (const value of chunk_arr) {
        if (Object.keys(value).length > 0) {
          let params_obj = [];
          let iterator = 0;
          for (const inValue of value) {
            let temp_obj = {};

            temp_obj['id'] = inValue[unique_key];
            temp_obj['body'] = inValue;
            params_obj.push(temp_obj);
            iterator++;
          }
          let data = await this.insertElasticData(
            sync_data.syn_vUniqueIndex,
            params_obj,
          );
          temp_data.push(data);
        }
      }
      final_obj_arr = temp_data;
      return final_obj_arr;
    } catch (err) {
      console.log(err);
      final_obj_arr['success'] = 0;
      final_obj_arr['message'] = 'No View Data Found';
      final_obj_arr['data'] = [];
    }
  }
  async insertActivityLogElasticData(index: string, data: any) {
    try {
      let server_name = await this.getConfigItem('ELASTIC_SERVER');
      server_name = server_name
        ? `NEST_${server_name.toUpperCase()}`
        : 'NEST_LOCAL';
      const index_name = server_name.toLowerCase() + '_' + index.toLowerCase();
      if (typeof data == 'undefined' || Object.keys(data).length <= 0) {
        throw new Error('NO data to Insert');
      }
      let bulk_raw_json = '';
      let tmpraw = { index: { _index: index_name, _id: data.id } };
      bulk_raw_json += JSON.stringify(tmpraw) + '\n';
      bulk_raw_json += JSON.stringify(data) + '\n';
      const res_body = await this.esClient.bulk({ body: [bulk_raw_json] });
      return res_body;
      return index_name;
    } catch (err) {
      console.log(err);
      console.log('NO data to Insert');
    }
  }
  async insertElasticData(index: string, data: any) {
    try {
      if (index == 'cars') {
        data.forEach((item) => {
          if (
            item.body.carOtherImages &&
            item.body.carOtherImages.trim() !== ''
          ) {
            item.body.carOtherImages = item.body.carOtherImages.split(',');
          } else {
            item.body.carOtherImages = [];
          }

          if (item.body.tagCodes && item.body.tagCodes.trim() !== '') {
            item.body.car_tag = item.body.tagCodes.split(',');
          } else {
            item.body.car_tag = [];
          }
          if (
            item.body.exteriorImages &&
            item.body.exteriorImages.trim() !== ''
          ) {
            item.body.exteriorImages = item.body.exteriorImages.split(',');
          }
          if (
            item.body.interiorImages &&
            item.body.interiorImages.trim() !== ''
          ) {
            item.body.interiorImages = item.body.interiorImages.split(',');
          }
        });
        data.forEach((car) => {
          delete car.body.imageType;
          delete car.body.car_tags;
          delete car.body.carOtherImages;
        });
      }
      data.forEach((item) => {
        for (const key in item.body) {
          if (key.endsWith('_codes')) {
            if (item.body[key] && item.body[key].trim() !== '') {
              item.body[key] = item.body[key].split(',');
            }
          }
          if (key === 'custom_field') {
            if (item.body[key] && item.body[key].trim() !== '') {
              try {
                const parsed = JSON.parse(item.body[key]);
                if (parsed && typeof parsed === 'object') {
                  item.body[key + '_json'] = parsed;
                }
              } catch (e) {}
            }
          }
        }
      });

      let server_name = await this.getConfigItem('ELASTIC_SERVER');
      server_name = server_name
        ? `NEST_${server_name.toUpperCase()}`
        : 'NEST_LOCAL';
      const index_name = server_name.toLowerCase() + '_' + index.toLowerCase();
      let indexExistData = await this.checkMultipleIndexes([index_name]);
      let index_exist = indexExistData[index_name];
      if (typeof data == 'undefined' || Object.keys(data).length <= 0) {
        throw new Error('NO data to Insert');
      }
      let bulk_raw_json = '';

      for (const v of data) {
        let tmpraw = { index: { _index: index_name, _id: v.id } };
        if (index == 'cars' || index == 'location') {
          const lat = parseFloat(v.body.latitude);
          const lon = parseFloat(v.body.longitude);

          if (!isNaN(lat) && !isNaN(lon)) {
            v.body.address = {
              lat: lat,
              lon: lon,
            };
          } else {
            if ('address' in v.body) {
              delete v.body.address;
            }
          }
        }

        bulk_raw_json += JSON.stringify(tmpraw) + '\n';
        bulk_raw_json += JSON.stringify(v.body) + '\n';
      }
      const res_body = await this.esClient.bulk({ body: [bulk_raw_json] });
      return res_body;
      return index_name;
    } catch (err) {
      console.log(err);
      console.log('NO data to Insert');
    }
  }
  async transalateQuery(
    index: string,
    query: any,
    from?: number,
    limit?: number,
  ) {
    let feilds = query?.feilds;
    let final_query = {
      query:
        typeof feilds != 'undefined'
          ? `select ${feilds.join(',')} from ${index} ${query.query}`
          : `select * from ${index} ${query.query}`,
    };
    try {
      let size;
      if (limit > 0) {
        size = limit;
      }

      const response = await this.esClient.transport.request({
        method: 'POST',
        path: '/_sql/translate',
        body: final_query,
      });
      let modifified_query_res = this.modifyQuery({ query: response['query'] });
      const modifiedDslQuery = {
        query: modifified_query_res['query'],
        _source: true,
        fields: typeof feilds != 'undefined' ? response['fields'] : [],
        sort: response['sort'].length > 0 ? response['sort'] : [],
        track_total_hits: true,
      };
      return modifiedDslQuery;
    } catch (error) {
      console.error('Elasticsearch search error:', error);
      throw new InternalServerErrorException(
        'failed to fetch data from Elasticsearch',
      );
    }
  }
  modifyQuery(query) {
    const newQuery = JSON.parse(JSON.stringify(query));

    if (newQuery.query) {
      if (newQuery.query.bool && newQuery.query.bool.must) {
        newQuery.query.bool.must.forEach((clause) => {
          if (clause.wildcard) {
            const fieldName = Object.keys(clause.wildcard)[0];
            let wildcardValue = clause.wildcard[fieldName].wildcard;
            wildcardValue = wildcardValue == '?*' ? '_*' : wildcardValue;
            clause.wildcard[fieldName] = {
              value: wildcardValue,
              case_insensitive: true,
            };
          }
        });
      } else if (newQuery.query.wildcard) {
        const fieldName = Object.keys(newQuery.query.wildcard)[0];
        let wildcardValue = newQuery.query.wildcard[fieldName].wildcard;
        wildcardValue = wildcardValue == '?*' ? '_*' : wildcardValue;
        newQuery.query.wildcard[fieldName] = {
          value: wildcardValue,
          case_insensitive: true,
        };
      }
    }

    return newQuery;
  }
  async updateElasticDocument(
    slug: string,
    index: string,
    search_by: string,
    newKey: string,
    newValue: any,
  ) {
    try {
      const docRes = await this.getById(slug, index, search_by, 'Yes');
      const docId = docRes?._id;
      if (typeof docId != 'undefined' && docId != '') {
        const updatedSource = { ...docRes._source, [newKey]: newValue };
        /*
          let res = await this.esClient.update({
            index: index,
            id: docId,
            body: { doc: updatedSource },
          });
        */
        let res = await this.esClient.update({
          index: index,
          id: docId,
          body: {
            doc: {
              [newKey]: newValue,
            },
          },
          doc_as_upsert: true,
        });
        await this.esClient.indices.flush({ index, force: true });
        console.log(
          `Updated document with slug "${slug}" by adding "${newKey}".`,
        );
        return {
          success: 1,
          message: `Updated document with slug "${slug}" by adding "${newKey}".`,
        };
      } else {
        return {
          success: 0,
          message: 'No document to update',
        };
      }
    } catch (error) {
      console.error('Error updating document:', error);
    }
  }
  async getMapping(
    index: string,
  ): Promise<{ dateFields: string[]; mapping: any }> {
    try {
      const response = await this.esClient.indices.getMapping({
        index,
      });
      const mapping = response[index].mappings.properties;
      const dateFields = [];

      for (const [field, fieldMapping] of Object.entries(mapping)) {
        if (fieldMapping['type'] === 'date') {
          dateFields.push(field);
        }
      }

      return { dateFields, mapping };
    } catch (error) {
      console.error('Error fetching mapping:', error);
      throw new Error('Unable to fetch index mapping');
    }
  }
  async deleteDocument(index: string, docId: string): Promise<any> {
    try {
      const docRes = await this.getById(docId, index);
      if (_.isObject(docRes) && !_.isEmpty(docRes)) {
        const result = await this.esClient.delete({
          index,
          id: docId,
        });
        return result;
      } else {
        return 'Nothing to delete';
      }
    } catch (error) {
      throw new Error(`Error deleting document: ${error.message}`);
    }
  }
  async getConfigItem(key: string) {
    let val = null;
    const configVal = await this.cacheService.get(key);
    if (configVal !== null && configVal !== undefined) {
      val = configVal;
    } else if (key in this.configService.get('app')) {
      val = this.configService.get(`app.${key}`);
    }
    return val;
  }
  chunkArray(array, chunkSize) {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }
  async searchAggrregate(
    index: string,
    query: any,
    fullRes?: any,
    is_front?: string,
  ) {
    const elastic_limit = await this.getConfigItem('ELASTIC_REC_LIMIT');
    const isIndexExist = await this.checkMultipleIndexes([index]);
    if (!isIndexExist[index]) {
      throw new Error('No Data Found');
    }
    try {
      const response = await this.esClient.search({
        index,
        body: query,
      });
      return response.aggregations;
    } catch (error) {
      throw new InternalServerErrorException(
        'failed to fetch data from Elasticsearch',
      );
    }
  }
  async checkMultipleIndexes(
    indices: string[],
  ): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};

    await Promise.all(
      indices.map(async (index) => {
        try {
          const exists = await this.esClient.indices.exists({ index });
          results[index] = exists;
        } catch (err) {
          console.error(`Failed to check index ${index}:`, err.message);
          results[index] = false;
        }
      }),
    );
    return results;
  }
  async getDBIndexMapping(index: string) {
    let return_data;
    try {
      let queryObject: any = this.syncEntityRepo.createQueryBuilder('syn');
      if (typeof index != 'undefined' && index != '') {
        queryObject.where('vEntityType = :value', { value: index });
      }
      const data = await queryObject.execute();
      if (!_.isArray(data) || _.isEmpty(data)) {
        throw new Error('No records found.');
      }
      if (Object.keys(data).length > 0) {
        for (const value of data) {
          const entityName = value.syn_vMySqlEntity;

          // Get column names for the table or view
          const columnQuery = `
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = '${entityName}'
          `;

          const columns = await this.dataSource.query(columnQuery);
          const columnList = columns.map((c) => c.COLUMN_NAME);
          let server_name = await this.getConfigItem('ELASTIC_SERVER');
          server_name = server_name
            ? `NEST_${server_name.toUpperCase()}`
            : 'NEST_LOCAL';
          let index =
            server_name.toLowerCase() + '_' + value['syn_vUniqueIndex'];
          let mapping = await this.getMapping(index);
          return_data = {
            success: 1,
            message: 'Data Found Successfully.',
            data: columnList,
            mapping: mapping,
          };
        }
      }
    } catch (err) {
      console.log(err);
      return_data = {
        success: 0,
        message: 'No Data Found',
        data: [],
      };
    }
    return return_data;
  }

  buildElasticsearchSQLQuery(
    cleanedQueryParams: any,
    cleanedSortParams?: { [key: string]: any },
  ) {
    let conditions: string[] = [];
    let sortConditions: string[] = [];

    const isNumericString = (val: any) => {
      return typeof val === 'string' && !isNaN(val as any) && val.trim() !== '';
    };

    // Format value based on type
    // const formatValue = (val: any) => {
    //   if (typeof val === 'number') return `${val}`;
    //   if (isNumericString(val)) return `${Number(val)}`;
    //   return `'${val}'`;
    // };
    const formatValue = (val: any) => {
      if (val instanceof Date) {
        return `'${val.toISOString()}'`;
      }
      // Detect MySQL datetime string → convert to ISO
      if (
        typeof val === 'string' &&
        /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(val)
      ) {
        return `'${val.replace(' ', 'T')}Z'`;
      }
      if (typeof val === 'number') return `${val}`;
      if (isNumericString(val)) return `${Number(val)}`;
      return `'${val}'`;
    };
    if (cleanedQueryParams) {
      Object.entries(cleanedQueryParams).forEach(([_, values]) => {
        if (
          typeof values === 'object' &&
          'key' in values &&
          'value' in values &&
          'operator' in values
        ) {
          let { key, value, operator } = values;
          conditions.push(this.buildCondition(key, operator, value));
        } else if (
          typeof values === 'object' &&
          'keys' in values &&
          'value' in values &&
          'operator' in values
        ) {
          let { keys, value, operator }: any = values;
          if (keys.length > 1) {
            const orConditions = keys.map((key) =>
              this.buildCondition(key, operator, value),
            );
            conditions.push(`(${orConditions.join(' OR ')})`);
          }
        } else {
          conditions.push(`${_.toString()} = ${formatValue(values)}`);
        }
      });
    }

    if (cleanedSortParams && Object.keys(cleanedSortParams).length) {
      Object.entries(cleanedSortParams).forEach(([_, sort]) => {
        const { prop, dir } = sort as any;
        sortConditions.push(`${prop} ${dir.toUpperCase()}`);
      });
    }

    let query = '';

    if (conditions.length > 0) {
      query += `WHERE ${conditions.join(' AND ')}`;
    }

    if (sortConditions.length > 0) {
      query += ` ORDER BY ${sortConditions.join(', ')}`;
    }
    return query ? query : '';
  }
  buildCondition(key, operator, value) {
    const isNumericString = (val: any) => {
      return typeof val === 'string' && !isNaN(val as any) && val.trim() !== '';
    };
    // const formatValue = (val: any) => {
    //   if (typeof val === 'number') return `${val}`;
    //   if (isNumericString(val)) return `${Number(val)}`;
    //   return `'${val}'`;
    // };
    const formatValue = (val: any) => {
      if (val instanceof Date) {
        return `'${val.toISOString()}'`;
      }
      // Detect MySQL datetime string → convert to ISO
      if (
        typeof val === 'string' &&
        /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(val)
      ) {
        return `'${val.replace(' ', 'T')}Z'`;
      }
      if (typeof val === 'number') return `${val}`;
      if (isNumericString(val)) return `${Number(val)}`;
      return `'${val}'`;
    };
    switch (operator) {
      case 'begin':
        return !isNumericString(value)
          ? `${key} LIKE '${value}%'`
          : `CAST(${key} AS CHAR) LIKE '${value}%'`;

      case 'notbegin':
        return !isNumericString(value)
          ? `${key} NOT LIKE '${value}%'`
          : `CAST(${key} AS CHAR) NOT LIKE '${value}%'`;

      case 'end':
        return !isNumericString(value)
          ? `${key} LIKE '%${value}'`
          : `CAST(${key} AS CHAR) LIKE '%${value}'`;

      case 'notend':
        return !isNumericString(value)
          ? `${key} NOT LIKE '%${value}'`
          : `CAST(${key} AS CHAR) NOT LIKE '%${value}'`;

      case 'contain':
        return !isNumericString(value)
          ? `${key} LIKE '%${value}%'`
          : `CAST(${key} AS CHAR) LIKE '%${value}%'`;

      case 'notcontain':
        return !isNumericString(value)
          ? `${key} NOT LIKE '%${value}%'`
          : `CAST(${key} AS CHAR) NOT LIKE '%${value}%'`;

      case 'equal':
        return `${key} = ${!isNumericString(value) ? formatValue(value) : value}`;

      case 'notequal':
        return `${key} != ${!isNumericString(value) ? formatValue(value) : value}`;

      case 'in':
        if (Array.isArray(value)) {
          const inValues = value
            .map((v) => (!isNumericString(v) ? formatValue(v) : v))
            .join(', ');
          return `${key} IN (${inValues})`;
        }
        return `${key} IN (${!isNumericString(value) ? formatValue(value) : value})`;

      case 'notin':
        if (Array.isArray(value)) {
          const notInValues = value
            .map((v) => (!isNumericString(v) ? formatValue(v) : v))
            .join(', ');
          return `${key} NOT IN (${notInValues})`;
        }
        return `${key} NOT IN (${!isNumericString(value) ? formatValue(value) : value})`;

      case 'empty':
        return `${key} IS NULL`;

      case 'notempty':
        return `${key} IS NOT NULL`;

      case 'between':
        if (Array.isArray(value) && value.length === 2) {
          const [start, end] = value.map((v) => formatValue(v));
          return `${key} BETWEEN ${start} AND ${end}`;
        }
        return '';

      default:
        return `${key} = ${!isNumericString(value) ? formatValue(value) : value}`;
    }
  }
}
