import { Controller, Post, Body } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { GetStripePaymentIntentAndCustomerDto } from './dto/get-stripe-payment-intent-and-customer.dto';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/common/decorators/auth.decorator';
import { ValidRoles } from 'src/common/enums/valid-roles.enum';

@ApiTags('Stripe')
@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('getPaymentIntentAndCustomer')
  @Auth(ValidRoles.user)
  getPaymentIntentAndCustomer(
    @Body()
    getStripePaymentIntentAndCustomerDto: GetStripePaymentIntentAndCustomerDto,
  ) {
    return this.stripeService.getStripePaymentIntentAndCustomer(
      getStripePaymentIntentAndCustomerDto,
    );
  }
}
