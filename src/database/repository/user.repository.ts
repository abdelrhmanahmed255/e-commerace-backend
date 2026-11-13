import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../model/user.model';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(data: Partial<User>): Promise<UserDocument> {
    return await this.userModel.create(data);
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return await this.userModel.findOne({ email });
  }

  async findById(id: string): Promise<UserDocument | null> {
    return await this.userModel.findById(id);
  }

  async update(id: string, data: Partial<User>): Promise<UserDocument | null> {
    return await this.userModel.findByIdAndUpdate(id, data, { new: true });
  }

  async findAll(): Promise<UserDocument[]> {
    return await this.userModel.find();
  }
}
