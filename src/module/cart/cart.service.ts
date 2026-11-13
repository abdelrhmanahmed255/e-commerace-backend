import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CartRepository } from '../../database/repository/cart.repository';
import { ProductRepository } from '../../database/repository/product.repository';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { Types } from 'mongoose';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  private calculateSubTotal(products: any[]): number {
    const total = products.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    return Number(total.toFixed(2));
  }

  async addToCart(dto: AddToCartDto, userId: string) {
    const product = await this.productRepository.findById(dto.productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const quantity = dto.quantity || 1;
    if (product.stock < quantity) {
      throw new BadRequestException('Insufficient product stock');
    }

    let cart = await this.cartRepository.findOne({
      userId: new Types.ObjectId(userId),
    });

    if (!cart) {
      const products = [
        {
          productId: new Types.ObjectId(dto.productId),
          quantity,
          price: product.finalPrice,
        },
      ];
      return await this.cartRepository.create({
        userId: new Types.ObjectId(userId),
        products,
        subTotal: this.calculateSubTotal(products),
      });
    }

    const existingItem = cart.products.find(
      (item) => item.productId.toString() === dto.productId,
    );

    if (existingItem) {
      if (product.stock < existingItem.quantity + quantity) {
        throw new BadRequestException('Insufficient product stock');
      }
      existingItem.quantity += quantity;
      existingItem.price = product.finalPrice;
    } else {
      cart.products.push({
        productId: new Types.ObjectId(dto.productId),
        quantity,
        price: product.finalPrice,
      });
    }

    cart.subTotal = this.calculateSubTotal(cart.products);
    await cart.save();
    return cart;
  }

  async getCart(userId: string) {
    const cart = await this.cartRepository.findOne({
      userId: new Types.ObjectId(userId),
    });

    if (!cart) {
      return await this.cartRepository.create({
        userId: new Types.ObjectId(userId),
        products: [],
        subTotal: 0,
      });
    }

    return cart;
  }

  async removeFromCart(productId: string, userId: string) {
    const cart = await this.cartRepository.findOne({
      userId: new Types.ObjectId(userId),
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    cart.products = cart.products.filter(
      (item) => item.productId.toString() !== productId,
    );
    cart.subTotal = this.calculateSubTotal(cart.products);
    await cart.save();
    return cart;
  }

  async clearCart(userId: string) {
    return await this.cartRepository.clear(userId);
  }
}
