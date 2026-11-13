import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { AuthGuard } from '../../common/guard/auth.guard';
import { ParseMongoIdPipe } from '../../common/pipe/parse-mongo-id.pipe';

@Controller('cart')
@UseGuards(AuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  addToCart(@Body() dto: AddToCartDto, @Req() req: any) {
    return this.cartService.addToCart(dto, req.user._id);
  }

  @Get()
  getCart(@Req() req: any) {
    return this.cartService.getCart(req.user._id);
  }

  @Delete('clear')
  clearCart(@Req() req: any) {
    return this.cartService.clearCart(req.user._id);
  }

  @Delete(':productId')
  removeFromCart(
    @Param('productId', ParseMongoIdPipe) productId: string,
    @Req() req: any,
  ) {
    return this.cartService.removeFromCart(productId, req.user._id);
  }
}
