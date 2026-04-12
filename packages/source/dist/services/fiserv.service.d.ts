import { ConfigService } from '@nestjs/config';
export declare class FiservService {
    private readonly configService;
    private apiKey;
    private apiSecret;
    private baseUrl;
    private webhook;
    constructor(configService: ConfigService);
    private generateSignature;
    createCheckout(amount: number, currency: string, metadata: Record<string, string>, success_url: string, cancel_url: string): Promise<string>;
    verifyWebhookSignature(rawPayload: Buffer, signature: string, timestamp: string, clientRequestId: string): boolean;
}
//# sourceMappingURL=fiserv.service.d.ts.map