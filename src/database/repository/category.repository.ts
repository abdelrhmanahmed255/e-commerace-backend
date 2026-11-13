import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from '../model/category.model';

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {}

  async create(data: Partial<Category>): Promise<CategoryDocument> {
    return await this.categoryModel.create(data);
  }

  async findAll(filter: any = {}): Promise<CategoryDocument[]> {
    return await this.categoryModel.find({ deletedAt: null, ...filter });
  }

  async findById(id: string): Promise<CategoryDocument | null> {
    return await this.categoryModel.findOne({ _id: id, deletedAt: null });
  }

  async findOne(filter: any): Promise<CategoryDocument | null> {
    return await this.categoryModel.findOne({ deletedAt: null, ...filter });
  }

  async update(
    id: string,
    data: Partial<Category>,
  ): Promise<CategoryDocument | null> {
    return await this.categoryModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<CategoryDocument | null> {
    return await this.categoryModel.findByIdAndUpdate(
      id,
      { deletedAt: new Date() },
      { new: true },
    );
  }
}
