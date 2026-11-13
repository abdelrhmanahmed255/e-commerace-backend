import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard } from '../../common/guard/auth.guard';
import { ParseMongoIdPipe } from '../../common/pipe/parse-mongo-id.pipe';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() dto: CreateOrderDto, @Req() req: any) {
    return this.orderService.create(dto, req.user);
  }

  @Post(':id/checkout')
  @UseGuards(AuthGuard)
  checkout(
    @Param('id', ParseMongoIdPipe) id: string,
    @Req() req: any,
  ) {
    return this.orderService.createCheckoutSession(id, req.user);
  }

  @Post('webhook')
  webhook(
    @Req() req: any,
    @Headers('stripe-signature') signature: string,
  ) {
    const payload = req.rawBody || JSON.stringify(req.body);
    return this.orderService.handleWebhook(payload, signature);
  }

  @Patch(':id/cancel')
  @UseGuards(AuthGuard)
  cancel(
    @Param('id', ParseMongoIdPipe) id: string,
    @Req() req: any,
  ) {
    return this.orderService.cancelOrder(id, req.user);
  }

  @Get('my-orders')
  @UseGuards(AuthGuard)
  findMyOrders(@Req() req: any) {
    return this.orderService.findUserOrders(req.user._id);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.orderService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findById(@Param('id', ParseMongoIdPipe) id: string) {
    return this.orderService.findById(id);
  }
}
