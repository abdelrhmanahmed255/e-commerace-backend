import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Coupon, CouponDocument } from '../model/coupon.model';

@Injectable()
export class CouponRepository {
  constructor(
    @InjectModel(Coupon.name)
    private readonly couponModel: Model<CouponDocument>,
  ) {}

  async create(data: Partial<Coupon>): Promise<CouponDocument> {
    return await this.couponModel.create(data);
  }

  async findAll(filter: any = {}): Promise<CouponDocument[]> {
    return await this.couponModel.find({ deletedAt: null, ...filter });
  }

  async findById(id: string): Promise<CouponDocument | null> {
    return await this.couponModel.findOne({ _id: id, deletedAt: null });
  }

  async findOne(filter: any): Promise<CouponDocument | null> {
    return await this.couponModel.findOne({ deletedAt: null, ...filter });
  }

  async update(
    id: string,
    data: Partial<Coupon> | any,
  ): Promise<CouponDocument | null> {
    return await this.couponModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<CouponDocument | null> {
    return await this.couponModel.findByIdAndUpdate(
      id,
      { deletedAt: new Date() },
      { new: true },
    );
  }
}
