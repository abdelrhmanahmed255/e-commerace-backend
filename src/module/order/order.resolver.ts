import { Args, Context, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { CheckoutSessionType, OrderType } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard } from '../../common/guard/auth.guard';

@Resolver(() => OrderType)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Query(() => [OrderType], { name: 'myOrders' })
  @UseGuards(AuthGuard)
  findMyOrders(@Context() context: any) {
    return this.orderService.findUserOrders(context.req.user._id);
  }

  @Query(() => [OrderType], { name: 'allOrders' })
  @UseGuards(AuthGuard)
  findAll() {
    return this.orderService.findAll();
  }

  @Query(() => OrderType, { name: 'order' })
  @UseGuards(AuthGuard)
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.orderService.findById(id);
  }

  @Mutation(() => OrderType, { name: 'createOrder' })
  @UseGuards(AuthGuard)
  create(
    @Args('createOrderInput') createOrderInput: CreateOrderDto,
    @Context() context: any,
  ) {
    return this.orderService.create(createOrderInput, context.req.user);
  }

  @Mutation(() => CheckoutSessionType, { name: 'createCheckoutSession' })
  @UseGuards(AuthGuard)
  createCheckoutSession(
    @Args('orderId', { type: () => ID }) orderId: string,
    @Context() context: any,
  ) {
    return this.orderService.createCheckoutSession(orderId, context.req.user);
  }

  @Mutation(() => OrderType, { name: 'cancelOrder' })
  @UseGuards(AuthGuard)
  cancelOrder(
    @Args('orderId', { type: () => ID }) orderId: string,
    @Context() context: any,
  ) {
    return this.orderService.cancelOrder(orderId, context.req.user);
  }
}
