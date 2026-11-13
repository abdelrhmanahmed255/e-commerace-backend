import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Brand, BrandDocument } from '../model/brand.model';

@Injectable()
export class BrandRepository {
  constructor(
    @InjectModel(Brand.name) private readonly brandModel: Model<BrandDocument>,
  ) {}

  async create(data: Partial<Brand>): Promise<BrandDocument> {
    return await this.brandModel.create(data);
  }

  async findAll(filter: any = {}): Promise<BrandDocument[]> {
    return await this.brandModel.find({ deletedAt: null, ...filter });
  }

  async findById(id: string): Promise<BrandDocument | null> {
    return await this.brandModel.findOne({ _id: id, deletedAt: null });
  }

  async findOne(filter: any): Promise<BrandDocument | null> {
    return await this.brandModel.findOne({ deletedAt: null, ...filter });
  }

  async update(id: string, data: Partial<Brand>): Promise<BrandDocument | null> {
    return await this.brandModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<BrandDocument | null> {
    return await this.brandModel.findByIdAndUpdate(
      id,
      { deletedAt: new Date() },
      { new: true },
    );
  }
}
