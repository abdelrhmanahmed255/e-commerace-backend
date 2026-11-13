import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../model/product.model';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async create(data: Partial<Product>): Promise<ProductDocument> {
    return await this.productModel.create(data);
  }

  async findAll(filter: any = {}): Promise<ProductDocument[]> {
    return await this.productModel.find({ deletedAt: null, ...filter });
  }

  async findById(id: string): Promise<ProductDocument | null> {
    return await this.productModel.findOne({ _id: id, deletedAt: null });
  }

  async findOne(filter: any): Promise<ProductDocument | null> {
    return await this.productModel.findOne({ deletedAt: null, ...filter });
  }

  async update(
    id: string,
    data: Partial<Product>,
  ): Promise<ProductDocument | null> {
    return await this.productModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<ProductDocument | null> {
    return await this.productModel.findByIdAndUpdate(
      id,
      { deletedAt: new Date() },
      { new: true },
    );
  }
}
