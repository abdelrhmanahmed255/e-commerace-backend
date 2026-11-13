import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductRepository } from '../../database/repository/product.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Types } from 'mongoose';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private calculateFinalPrice(price: number, discountPercent = 0): number {
    const discount = (price * discountPercent) / 100;
    return Number((price - discount).toFixed(2));
  }

  async create(dto: CreateProductDto, userId: string) {
    const slug = this.slugify(dto.name);
    const existing = await this.productRepository.findOne({ slug });
    if (existing) {
      throw new BadRequestException('Product with this name already exists');
    }

    const discountPercent = dto.discountPercent || 0;
    const finalPrice = this.calculateFinalPrice(dto.price, discountPercent);

    return await this.productRepository.create({
      name: dto.name,
      slug,
      description: dto.description,
      price: dto.price,
      discountPercent,
      finalPrice,
      stock: dto.stock ?? 1,
      image: dto.image,
      categoryId: dto.categoryId ? new Types.ObjectId(dto.categoryId) : undefined,
      brandId: dto.brandId ? new Types.ObjectId(dto.brandId) : undefined,
      createdBy: new Types.ObjectId(userId),
      createdAt: new Date(),
    });
  }

  async findAll() {
    return await this.productRepository.findAll();
  }

  async findById(id: string) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async update(id: string, dto: UpdateProductDto, userId: string) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const updateData: any = {
      updatedBy: new Types.ObjectId(userId),
      updatedAt: new Date(),
    };

    if (dto.name) {
      updateData.name = dto.name;
      updateData.slug = this.slugify(dto.name);
    }

    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.stock !== undefined) updateData.stock = dto.stock;
    if (dto.image !== undefined) updateData.image = dto.image;
    if (dto.categoryId) updateData.categoryId = new Types.ObjectId(dto.categoryId);
    if (dto.brandId) updateData.brandId = new Types.ObjectId(dto.brandId);

    if (dto.price !== undefined || dto.discountPercent !== undefined) {
      const price = dto.price ?? product.price;
      const discountPercent = dto.discountPercent ?? product.discountPercent ?? 0;
      updateData.price = price;
      updateData.discountPercent = discountPercent;
      updateData.finalPrice = this.calculateFinalPrice(price, discountPercent);
    }

    return await this.productRepository.update(id, updateData);
  }

  async remove(id: string) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return await this.productRepository.delete(id);
  }
}
