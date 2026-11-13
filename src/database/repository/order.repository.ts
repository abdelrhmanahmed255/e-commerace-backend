import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from '../model/order.model';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
  ) {}

  async create(data: Partial<Order>): Promise<OrderDocument> {
    return await this.orderModel.create(data);
  }

  async findAll(filter: any = {}): Promise<OrderDocument[]> {
    return await this.orderModel.find(filter).sort({ createdAt: -1 });
  }

  async findById(id: string): Promise<OrderDocument | null> {
    return await this.orderModel.findById(id);
  }

  async findOne(filter: any): Promise<OrderDocument | null> {
    return await this.orderModel.findOne(filter);
  }

  async update(
    id: string,
    data: Partial<Order>,
  ): Promise<OrderDocument | null> {
    return await this.orderModel.findByIdAndUpdate(id, data, { new: true });
  }
}
