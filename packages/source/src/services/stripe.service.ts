import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY'),
    );
  }

  // Create a Stripe Customer
  async createCustomer(email: string, name?: string): Promise<Stripe.Customer> {
    try {
      return await this.stripe.customers.create({ email, name });
    } catch (err) {
      console.error('Stripe createCustomer error:', err);
      throw new InternalServerErrorException('Failed to create customer');
    }
  }

  // Create a Payment Intent
  async createPaymentIntent(
    amount: number,
    currency: string,
    customerId?: string,
    metadata: Record<string, string> = {},
  ): Promise<Stripe.PaymentIntent> {
    try {
      return await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Stripe requires amount in smallest unit
        currency,
        customer: customerId,
        metadata,
        automatic_payment_methods: { enabled: true },
      });
    } catch (err) {
      console.error('Stripe createPaymentIntent error:', err);
      throw new InternalServerErrorException('Failed to create payment intent');
    }
  }

  // Retrieve a Payment Intent
  async retrievePaymentIntent(
    paymentIntentId: string,
  ): Promise<Stripe.PaymentIntent> {
    try {
      return await this.stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (err) {
      console.error('Stripe retrievePaymentIntent error:', err);
      throw new InternalServerErrorException(
        'Failed to retrieve payment intent',
      );
    }
  }

  // Create a Checkout Session
  async createCheckoutSession(
    sessionData: Stripe.Checkout.SessionCreateParams,
  ): Promise<Stripe.Checkout.Session> {
    try {
      return await this.stripe.checkout.sessions.create(sessionData);
    } catch (err) {
      console.error('Stripe createCheckoutSession error:', err);
      throw new InternalServerErrorException(
        'Failed to create checkout session',
      );
    }
  }

  // Retrieve a Checkout Session
  async retrieveCheckoutSession(
    sessionId: string,
  ): Promise<Stripe.Checkout.Session> {
    try {
      return await this.stripe.checkout.sessions.retrieve(sessionId);
    } catch (err) {
      console.error('Stripe retrieveCheckoutSession error:', err);
      throw new InternalServerErrorException(
        'Failed to retrieve checkout session',
      );
    }
  }

  // Handle Webhook Events (Verify Signature)
  constructWebhookEvent(
    payload: Buffer,
    signature: string,
    endpointSecret: string,
  ): Stripe.Event {
    try {
      return this.stripe.webhooks.constructEvent(
        payload,
        signature,
        endpointSecret,
      );
    } catch (err) {
      console.error('Stripe webhook signature verification failed:', err);
      throw new InternalServerErrorException(
        'Invalid Stripe webhook signature',
      );
    }
  }

  // Optional: Refund a Payment
  async refundPayment(paymentIntentId: string): Promise<Stripe.Refund> {
    try {
      return await this.stripe.refunds.create({
        payment_intent: paymentIntentId,
      });
    } catch (err) {
      console.error('Stripe refund error:', err);
      throw new InternalServerErrorException('Failed to refund payment');
    }
  }

  // Optional: Create a SetupIntent (for saving cards)
  async createSetupIntent(customerId: string): Promise<Stripe.SetupIntent> {
    try {
      return await this.stripe.setupIntents.create({
        customer: customerId,
        automatic_payment_methods: { enabled: true },
      });
    } catch (err) {
      console.error('Stripe createSetupIntent error:', err);
      throw new InternalServerErrorException('Failed to create setup intent');
    }
  }
  //Payment URL
  async createPaymentUrl(
    amount: number,
    currency: string,
    metadata: Record<string, string> = {},
    success_url: string,
    cancel_url: string,
    payment_types: [],
  ): Promise<string> {
    try {
      const sessionData: Stripe.Checkout.SessionCreateParams = {
        payment_method_types: payment_types,
        mode: 'payment',
        line_items: [
          {
            price_data: {
              currency,
              product_data: {
                name: 'Service Payment',
              },
              unit_amount: Math.round(amount * 100),
            },
            quantity: 1,
          },
        ],
        success_url: success_url,
        cancel_url: cancel_url,
        metadata,
      };

      const session = await this.createCheckoutSession(sessionData);
      return session.url!;
    } catch (error) {
      console.error('Error creating payment URL:', error);
      throw new Error('Failed to create payment URL');
    }
  }
}
