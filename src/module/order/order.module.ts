import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderResolver } from './order.resolver';
import { OrderModel } from '../../database/model/order.model';
import { OrderRepository } from '../../database/repository/order.repository';
import { CartModule } from '../cart/cart.module';
import { ProductModule } from '../product/product.module';
import { CouponModule } from '../coupon/coupon.module';
import { AuthModule } from '../auth/auth.module';
import { StripeService } from '../../common/services/stripe.service';

@Module({
  imports: [OrderModel, CartModule, ProductModule, CouponModule, AuthModule],
  controllers: [OrderController],
  providers: [OrderService, OrderResolver, OrderRepository, StripeService],
  exports: [OrderService, OrderRepository],
})
export class OrderModule {}
