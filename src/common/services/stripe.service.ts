import { BadRequestException, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { envConfig } from '../../config/env.config';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(envConfig.stripe.secretKey);
  }

  async createCheckoutSession({
    customerEmail,
    metadata,
    lineItems,
    discounts = [],
  }: {
    customerEmail: string;
    metadata: Record<string, string>;
    lineItems: Stripe.Checkout.SessionCreateParams.LineItem[];
    discounts?: Stripe.Checkout.SessionCreateParams.Discount[];
  }) {
    try {
      const session = await this.stripe.checkout.sessions.create({
        mode: 'payment',
        customer_email: customerEmail,
        metadata,
        success_url: envConfig.stripe.successUrl,
        cancel_url: envConfig.stripe.cancelUrl,
        line_items: lineItems,
        discounts,
      });

      return session;
    } catch (error: any) {
      throw new BadRequestException(
        `Stripe session error: ${error.message || 'Failed to create checkout session'}`,
      );
    }
  }

  async createCoupon(percentOff: number): Promise<Stripe.Coupon> {
    return await this.stripe.coupons.create({
      percent_off: percentOff,
      duration: 'once',
    });
  }

  async refundPayment(paymentIntentId: string): Promise<Stripe.Refund> {
    try {
      return await this.stripe.refunds.create({
        payment_intent: paymentIntentId,
      });
    } catch (error: any) {
      throw new BadRequestException(
        `Stripe refund error: ${error.message || 'Failed to refund payment'}`,
      );
    }
  }

  constructWebhookEvent(payload: Buffer | string, signature: string) {
    try {
      return this.stripe.webhooks.constructEvent(
        payload,
        signature,
        envConfig.stripe.webhookSecret,
      );
    } catch (error: any) {
      throw new BadRequestException(`Webhook Error: ${error.message}`);
    }
  }
}
