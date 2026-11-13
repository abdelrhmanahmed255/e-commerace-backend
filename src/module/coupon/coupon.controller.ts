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
import { CouponService } from './coupon.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { AuthGuard } from '../../common/guard/auth.guard';
import { ParseMongoIdPipe } from '../../common/pipe/parse-mongo-id.pipe';

@Controller('coupons')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() dto: CreateCouponDto, @Req() req: any) {
    return this.couponService.create(dto, req.user._id);
  }

  @Get()
  findAll() {
    return this.couponService.findAll();
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.couponService.remove(id);
  }
}
