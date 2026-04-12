import { Inject, Injectable } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';
import * as _ from 'lodash';
import { format } from 'date-fns';
import { CitGeneralLibrary } from '@repo/source/utilities/cit-general-library';
@Injectable()
export class CallingEmailExecution {
  @Inject() protected readonly general: CitGeneralLibrary;
  constructor() {}
  async callEmailExecutionApi(data: any) {
    try {
      const apiUrl = `${process.env.NOTIFICATION_BASE_URL}/gearman-notification-execution`;
      const headers = {
        'Content-Type': 'application/json',
      };
      const params = {
        notification_id: String(data.notification_id),
      };
      const response = await this.general.callThirdPartyApi(
        'POST',
        apiUrl,
        params,
        headers,
      );
      return response;
    } catch (error) {
      console.error('⚠️ Job failed:', error);
    }
  }
}
