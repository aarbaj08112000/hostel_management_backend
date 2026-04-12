require('dotenv').config();
const TRANSACTION_URL = process.env.TRANSACTION_URL || '127.0.0.1';
const TRANSACTION_PORT = parseInt(process.env.TRANSACTION_PORT || '6004', 10);

const USER_URL = process.env.USER_URL || '127.0.0.1';
const USER_PORT = parseInt(process.env.USER_PORT || '6005', 10);

const CAR_URL = process.env.CAR_URL || '127.0.0.1';
const CAR_PORT = parseInt(process.env.CAR_PORT || '6001', 10);

const CUSTOMER_URL = process.env.CUSTOMER_URL || '127.0.0.1';
const CUSTOMER_PORT = parseInt(process.env.CUSTOMER_PORT || '6002', 10);

const MASTER_URL = process.env.MASTER_URL || '127.0.0.1';
const MASTER_PORT = parseInt(process.env.MASTER_PORT || '6003', 10);

const CRM_URL = '127.0.0.1';
const CRM_PORT = parseInt(process.env.CRM_PORT || '6008', 10);

import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import {
  Client,
  ClientProxy,
  ClientProxyFactory,
  ClientTCP,
  Transport,
} from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CronJobs } from '@repo/source/config/cit-jobs-config';
@Injectable()
export class CronService {
  private client: ClientProxy;
  @Client({
    transport: Transport.TCP,
    options: { port: TRANSACTION_PORT, host: TRANSACTION_URL },
  })
  public transClient: ClientTCP;
  @Client({
    transport: Transport.TCP,
    options: { port: USER_PORT, host: USER_URL },
  })
  public userClient: ClientTCP;
  @Client({
    transport: Transport.TCP,
    options: { port: CAR_PORT, host: CAR_URL },
  })
  public carClient: ClientTCP;
  @Client({
    transport: Transport.TCP,
    options: { port: CUSTOMER_PORT, host: CUSTOMER_URL },
  })
  public customerClient: ClientTCP;
  @Client({
    transport: Transport.TCP,
    options: { port: MASTER_PORT, host: MASTER_URL },
  })
  public masterClient: ClientTCP;
  @Client({
    transport: Transport.TCP,
    options: { port: CRM_PORT, host: CRM_URL },
  })
  public crmClient: ClientTCP;

  @Cron('0 0 */2 * * *')
  async handleCron() {
    console.log('Cron triggered: calling expire...');
    try {
      if (!this.transClient['isConnected']) {
        await this.transClient.connect();
        console.log(this.transClient['isConnected']);
      }

      const payload = {};
      const task = 'expire-booking';
      if (!CronJobs[process.env.PORT].includes(task)) {
        return true;
      }
      const response = await firstValueFrom(
        this.transClient.send('expire-booking', payload),
      );
      console.log('Microservice responded:', response);
    } catch (err) {
      console.error('Microservice call failed:', err.message);
    }
  }
  @Cron('0 0 1 * * *')
  async handleBookingReminderCron() {
    console.log('Cron triggered: calling booking reminder...');
    try {
      if (!this.transClient['isConnected']) {
        await this.transClient.connect();
        console.log(this.transClient['isConnected']);
      }

      const payload = {};
      const task = 'reminder-booking';
      if (!CronJobs[process.env.PORT].includes(task)) {
        return true;
      }
      const response = await firstValueFrom(
        this.transClient.send('reminder-booking', payload),
      );
      console.log('Microservice responded:', response);
    } catch (err) {
      console.error('Microservice call failed:', err.message);
    }
  }
  @Cron('0 0 */9 * * *')
  async handleReview() {
    console.log('Cron triggered: calling microservice...');
    try {
      if (!this.userClient['isConnected']) {
        await this.userClient.connect();
      }

      const payload = {};
      const task = 'fetch-review';
      if (!CronJobs[process.env.PORT].includes(task)) {
        return true;
      }
      const response = await firstValueFrom(
        this.userClient.send('fetch-review', payload),
      );
      console.log('Microservice responded:', response);
    } catch (err) {
      console.error('Microservice call failed:', err.message);
    }
  }
  @Cron('0 0 */5 * * *')
  async syncElastic() {
    console.log('Cron triggered: calling microservice...');
    try {
      const clients = [
        {
          code: 'customer',
          instance: () => this.customerClient,
          pattern: 'sync-data',
        },
        {
          code: 'master',
          instance: () => this.masterClient,
          pattern: 'sync-data',
        },
        { code: 'car', instance: () => this.carClient, pattern: 'sync-data' },
        { code: 'user', instance: () => this.userClient, pattern: 'sync-data' },
        {
          code: 'transaction',
          instance: () => this.transClient,
          pattern: 'sync-data',
        },
      ];
      const payload = {};
      for (const clientConfig of clients) {
        const clientInstance = clientConfig.instance();
        if (clientInstance && typeof clientInstance.emit === 'function') {
          clientInstance.emit('sync-data', payload);
        } else {
          console.warn(
            `Client for ${clientConfig.code} is not initialized correctly.`,
          );
        }
      }
    } catch (err) {
      console.error('Microservice call failed:', err.message);
    }
  }

  @Cron('0 0 */1 * * *')
  async syncIndexData() {
    try {
      if (!this.masterClient['isConnected']) {
        await this.masterClient.connect();
        console.log(this.transClient['isConnected']);
      }
      const payload = {};
      const task = 'index-sync';
      if (!CronJobs[process.env.PORT].includes(task)) {
        return true;
      }
      const response = await firstValueFrom(
        this.masterClient.send('index-sync', payload),
      );
      console.log('Microservice responded:', response);
    } catch (err) {
      console.log(err);
    }
  }

  @Cron('0 */30 * * * *')
  async handleWhatsappConversation() {
    return true;
    console.log('Cron triggered: calling expire...');
    try {
      if (!this.crmClient['isConnected']) {
        await this.crmClient.connect();
        console.log(this.crmClient['isConnected']);
      }

      const payload = {};
      const task = 'close-conversation';
      if (!CronJobs[process.env.PORT].includes(task)) {
        return true;
      }
      const response = await firstValueFrom(
        this.crmClient.send('close-conversation', payload),
      );
      console.log('Microservice responded:', response);
    } catch (err) {
      console.error('Microservice call failed:', err.message);
    }
  }
}
