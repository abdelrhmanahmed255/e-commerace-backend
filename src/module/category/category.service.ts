import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CategoryRepository } from '../../database/repository/category.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Types } from 'mongoose';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  async create(dto: CreateCategoryDto, userId: string) {
    const slug = this.slugify(dto.name);
    const existing = await this.categoryRepository.findOne({ slug });
    if (existing) {
      throw new BadRequestException('Category with this name already exists');
    }

    return await this.categoryRepository.create({
      name: dto.name,
      slug,
      image: dto.image,
      createdBy: new Types.ObjectId(userId),
      createdAt: new Date(),
    });
  }

  async findAll() {
    return await this.categoryRepository.findAll();
  }

  async findById(id: string) {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async update(id: string, dto: UpdateCategoryDto, userId: string) {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const updateData: any = {
      updatedBy: new Types.ObjectId(userId),
      updatedAt: new Date(),
    };

    if (dto.name) {
      updateData.name = dto.name;
      updateData.slug = this.slugify(dto.name);
    }

    if (dto.image !== undefined) {
      updateData.image = dto.image;
    }

    return await this.categoryRepository.update(id, updateData);
  }

  async remove(id: string) {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return await this.categoryRepository.delete(id);
  }
}
