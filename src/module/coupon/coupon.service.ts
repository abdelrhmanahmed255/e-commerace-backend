import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CouponRepository } from '../../database/repository/coupon.repository';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { Types } from 'mongoose';

@Injectable()
export class CouponService {
  constructor(private readonly couponRepository: CouponRepository) {}

  async create(dto: CreateCouponDto, userId: string) {
    const code = dto.code.trim().toUpperCase();
    const existing = await this.couponRepository.findOne({ code });
    if (existing) {
      throw new BadRequestException('Coupon code already exists');
    }

    const fromDate = new Date(dto.fromDate);
    const toDate = new Date(dto.toDate);
    if (toDate <= fromDate) {
      throw new BadRequestException('toDate must be after fromDate');
    }

    return await this.couponRepository.create({
      code,
      amount: dto.amount,
      fromDate,
      toDate,
      createdBy: new Types.ObjectId(userId),
    });
  }

  async findAll() {
    return await this.couponRepository.findAll();
  }

  async remove(id: string) {
    const coupon = await this.couponRepository.findById(id);
    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    return await this.couponRepository.delete(id);
  }
}
