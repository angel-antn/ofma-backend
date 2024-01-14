import { Controller, Post, Body } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { GetStripePaymentIntentAndCustomerDto } from './dto/get-stripe-payment-intent-and-customer.dto';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('getPaymentIntentAndCustomer')
  getPaymentIntentAndCustomer(
    @Body()
    getStripePaymentIntentAndCustomerDto: GetStripePaymentIntentAndCustomerDto,
  ) {
    return this.stripeService.getStripePaymentIntentAndCustomer(
      getStripePaymentIntentAndCustomerDto,
    );
  }
}
