import { Injectable } from '@nestjs/common';
import { GetStripePaymentIntentAndCustomerDto } from './dto/get-stripe-payment-intent-and-customer.dto';
import {
  Customer,
  StripeCustomerRequestInterface,
} from './interfaces/stripe_customer_request.interface';
import { StripePaymentIntentRequestInterface } from './interfaces/stripe_payment_intent.interface';
import { lastValueFrom, map } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class StripeService {
  constructor(private readonly httpService: HttpService) {}
  async getStripePaymentIntentAndCustomer(
    getStripePaymentIntentAndCustomerDto: GetStripePaymentIntentAndCustomerDto,
  ) {
    const { name, lastname, email, amount } =
      getStripePaymentIntentAndCustomerDto;
    const customer = await this.getStripeCustomer(name, lastname, email);
    const paymentIntent = await this.getPaymentIntent(amount, customer.id);

    return {
      clientSecret: paymentIntent.client_secret,
      customerId: customer.id,
      paymentIntentId: paymentIntent.id,
    };
  }

  private async getStripeCustomer(
    name: string,
    lastname: string,
    email: string,
  ): Promise<Customer> {
    const stripeCustomerRequest = await lastValueFrom(
      await this.httpService
        .get('https://api.stripe.com/v1/customers/search', {
          params: {
            query: `name:'${name} ${lastname}' AND email:'${email}'`,
          },
          headers: {
            Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
        .pipe(
          map((res) => {
            return res.data as StripeCustomerRequestInterface;
          }),
        ),
    );

    if (!stripeCustomerRequest.data[0]) {
      return this.createStripeCustomer(name, lastname, email);
    } else {
      return stripeCustomerRequest.data[0];
    }
  }

  private async createStripeCustomer(
    name: string,
    lastname: string,
    email: string,
  ): Promise<Customer> {
    const stripeCustomer = await lastValueFrom(
      this.httpService
        .post(
          'https://api.stripe.com/v1/customers',
          {
            email,
            name: `${name} ${lastname}`,
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        )
        .pipe(
          map((res) => {
            return res.data as Customer;
          }),
        ),
    );

    return stripeCustomer;
  }

  private async getPaymentIntent(
    amount: string,
    customerId: string,
  ): Promise<StripePaymentIntentRequestInterface> {
    const paymentIntent = await lastValueFrom(
      this.httpService
        .post(
          'https://api.stripe.com/v1/payment_intents',
          {
            amount: this.calculateStripeAmount(amount),
            currency: 'USD',
            customer: customerId,
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        )
        .pipe(
          map((res) => {
            return res.data as StripePaymentIntentRequestInterface;
          }),
        ),
    );

    return paymentIntent;
  }

  private calculateStripeAmount(amount: string): number {
    return Math.floor(Math.abs(parseFloat(amount)) * 100);
  }
}
