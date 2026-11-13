import { Module } from '@nestjs/common';
import { CouponController } from './coupon.controller';
import { CouponService } from './coupon.service';
import { CouponModel } from '../../database/model/coupon.model';
import { CouponRepository } from '../../database/repository/coupon.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [CouponModel, AuthModule],
  controllers: [CouponController],
  providers: [CouponService, CouponRepository],
  exports: [CouponService, CouponRepository],
})
export class CouponModule {}
