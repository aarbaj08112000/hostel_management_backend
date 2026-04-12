import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import * as gearmanode from 'gearmanode';
import { ElasticService } from './elastic.service';
import { CitGeneralLibrary } from '@repo/source/utilities/cit-general-library';
import { CallingEmailExecution } from './email-execution.service';
@Injectable()
export class GearmanWorkerService implements OnModuleInit {
  private worker: any;
  @Inject() protected readonly general: CitGeneralLibrary;
  constructor(
    private readonly elasticService: ElasticService,
    private readonly callingEmailExecution: CallingEmailExecution,
  ) {}
  onModuleInit() {
    if (process.env.GEARMAN_ENABLE != 'Yes') {
      return true;
    }
    const worker = gearmanode.worker({
      servers: [
        { host: process.env.GEARMAN_HOST, port: process.env.GEARMAN_PORT },
      ],
    });

    worker.addFunction('sync_elastic_data', (job) => {
      try {
        console.log('🛠 Processing job:', job.payload.toString());
        return new Promise((resolve, reject) => {
          let result = this.elasticService.syncElasticData(
            job.payload.toString(),
          );
          resolve(result);
          job.workComplete(result);
          console.log('✅ Job completed with result:', result);
        });
      } catch (error) {
        job.workFail();
        console.error('⚠️ Job failed:', error);
      }
    });

    // send email job
    worker.addFunction('send_email', (job) => {
      try {
        const data = JSON.parse(job.payload.toString());
        console.log(`🛠️ params: ${data}`);
        let result = this.callingEmailExecution.callEmailExecutionApi(data);
        job.workComplete(result.toString());
      } catch (error) {
        job.workFail();
        console.error('⚠️ Job failed:', error);
      }
    });

    console.log('✅ Gearman Worker Started - Listening for jobs');
  }
}
