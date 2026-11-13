import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BrandRepository } from '../../database/repository/brand.repository';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Types } from 'mongoose';

@Injectable()
export class BrandService {
  constructor(private readonly brandRepository: BrandRepository) {}

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  async create(dto: CreateBrandDto, userId: string) {
    const slug = this.slugify(dto.name);
    const existing = await this.brandRepository.findOne({ slug });
    if (existing) {
      throw new BadRequestException('Brand with this name already exists');
    }

    return await this.brandRepository.create({
      name: dto.name,
      slug,
      image: dto.image,
      createdBy: new Types.ObjectId(userId),
      createdAt: new Date(),
    });
  }

  async findAll() {
    return await this.brandRepository.findAll();
  }

  async findById(id: string) {
    const brand = await this.brandRepository.findById(id);
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }
    return brand;
  }

  async update(id: string, dto: UpdateBrandDto, userId: string) {
    const brand = await this.brandRepository.findById(id);
    if (!brand) {
      throw new NotFoundException('Brand not found');
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

    return await this.brandRepository.update(id, updateData);
  }

  async remove(id: string) {
    const brand = await this.brandRepository.findById(id);
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    return await this.brandRepository.delete(id);
  }
}
