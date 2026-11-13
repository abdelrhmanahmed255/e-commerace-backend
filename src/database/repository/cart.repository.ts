import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart, CartDocument } from '../model/cart.model';

@Injectable()
export class CartRepository {
  constructor(
    @InjectModel(Cart.name) private readonly cartModel: Model<CartDocument>,
  ) {}

  async create(data: Partial<Cart>): Promise<CartDocument> {
    return await this.cartModel.create(data);
  }

  async findOne(filter: any): Promise<CartDocument | null> {
    return await this.cartModel.findOne(filter);
  }

  async update(id: string, data: Partial<Cart>): Promise<CartDocument | null> {
    return await this.cartModel.findByIdAndUpdate(id, data, { new: true });
  }

  async clear(userId: string): Promise<CartDocument | null> {
    return await this.cartModel.findOneAndUpdate(
      { userId },
      { products: [], subTotal: 0 },
      { new: true },
    );
  }
}
