import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FiservService {
  private apiKey: string;
  private apiSecret: string;
  private baseUrl: string;
  private webhook: string;
  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('FISERV_API_KEY');
    this.apiSecret = this.configService.get<string>('FISERV_SECRET_KEY');
    this.baseUrl = this.configService.get<string>('FISERV_BASE_URL');
    this.webhook = this.configService.get<string>('FISERB_WEBHOOK');
  }
  private generateSignature(
    payload: string,
    timestamp: string,
    clientRequestId: string,
  ): string {
    const message = this.apiKey + clientRequestId + timestamp + payload;
    const hmac = crypto.createHmac('sha256', this.apiSecret);
    hmac.update(message, 'utf8');
    return hmac.digest('base64');
  }

  async createCheckout(
    amount: number,
    currency: string,
    metadata: Record<string, string> = {},
    success_url: string,
    cancel_url: string,
  ): Promise<string> {
    const clientRequestId = uuidv4();
    const timestamp = Date.now().toString();
    const uniqueSeparate = this.configService.get<string>('ENVIRONMENT');
    const payload = {
      transactionOrigin: 'ECOM',
      transactionType: 'SALE',
      transactionAmount: {
        total: amount,
        currency: currency,
      },
      checkoutSettings: {
        locale: 'en_GB',
        redirectBackUrls: {
          successUrl: success_url,
          failureUrl: cancel_url,
        },
        webHooksUrl: this.webhook + '/fiserv/webhook',
      },
      paymentMethodDetails: {
        cards: {
          authenticationPreferences: {
            challengeIndicator: '01',
            skipTra: false,
          },
          createToken: {
            declineDuplicateToken: false,
            reusable: true,
            toBeUsedFor: 'UNSCHEDULED',
          },
          tokenBasedTransaction: {
            transactionSequence: 'FIRST',
          },
        },
        sepaDirectDebit: {
          transactionSequenceType: 'SINGLE',
        },
      },
      storeId: this.configService.get<string>('FISERV_STORE_ID'),
      order: {
        orderId: metadata?.payment_code + uniqueSeparate,
      },
    };

    const jsonPayload = JSON.stringify(payload);
    const signature = this.generateSignature(
      jsonPayload,
      timestamp,
      clientRequestId,
    );

    const headers = {
      'Content-Type': 'application/json',
      'Api-Key': this.apiKey,
      Timestamp: timestamp,
      'Client-Request-Id': clientRequestId,
      'Message-Signature': signature,
    };
    console.log(payload);
    try {
      const response: any = await axios.post(`${this.baseUrl}`, jsonPayload, {
        headers,
      });
      if (response.status === 201 && response.data?.checkout?.redirectionUrl) {
        return response.data.checkout.redirectionUrl;
      }

      throw new Error('Missing checkout redirection URL in response');
    } catch (err) {
      console.error('Fiserv createCheckout error:', err.response?.data || err);
      throw new InternalServerErrorException(
        'Failed to create Fiserv checkout',
      );
    }
  }
  verifyWebhookSignature(
    rawPayload: Buffer,
    signature: string,
    timestamp: string,
    clientRequestId: string,
  ): boolean {
    const message =
      this.apiKey + clientRequestId + timestamp + rawPayload.toString('utf8');
    const hmac = crypto.createHmac('sha256', this.apiSecret);
    hmac.update(message, 'utf8');
    const expectedSignature = hmac.digest('base64');

    try {
      return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature),
      );
    } catch (err) {
      console.error('Signature comparison failed:', err);
      return false;
    }
  }
}
