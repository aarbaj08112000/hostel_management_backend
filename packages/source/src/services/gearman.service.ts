import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as gearmanode from 'gearmanode';

@Injectable()
export class GearmanService implements OnModuleInit, OnModuleDestroy {
  private client: any;

  onModuleInit() {
    if (process.env.GEARMAN_ENABLE == 'Yes') {
      this.client = gearmanode.client();
      console.log('✅ Gearman Client Initialized');
    }
  }

  onModuleDestroy() {
    this.client.close();
    console.log('🛑 Gearman Client Closed');
  }

  submitJob(jobName: string, workload: any): Promise<string> {
    return new Promise((resolve, reject) => {
      console.log(`📤 Sending job "${jobName}" with workload:`, workload);
      const job = this.client.submitJob(jobName, JSON.stringify(workload), {
        encoding: 'utf8',
      });
      job.on('workData', function (data) {
        console.log('WORK_DATA >>> ' + data);
      });
      job.on('complete', function () {
        const result = job.response.toString('utf8');
        console.log('RESULT >>> ' + job.response);
        resolve(job.response);
      });
    });
  }
}
