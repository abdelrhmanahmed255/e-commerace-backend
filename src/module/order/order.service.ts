import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderRepository } from '../../database/repository/order.repository';
import { CartRepository } from '../../database/repository/cart.repository';
import { ProductRepository } from '../../database/repository/product.repository';
import { CouponRepository } from '../../database/repository/coupon.repository';
import { StripeService } from '../../common/services/stripe.service';
import { CreateOrderDto } from './dto/create-order.dto';
import {
  IOrderProduct,
  OrderStatus,
  PaymentMethod,
} from '../../common/interface/order.interface';
import { Types } from 'mongoose';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly cartRepository: CartRepository,
    private readonly productRepository: ProductRepository,
    private readonly couponRepository: CouponRepository,
    private readonly stripeService: StripeService,
  ) {}

  async create(dto: CreateOrderDto, user: any) {
    const userId = user._id.toString();
    const cart = await this.cartRepository.findOne({
      userId: new Types.ObjectId(userId),
    });

    if (!cart || !cart.products.length) {
      throw new BadRequestException('Cart is empty');
    }

    const orderProducts: IOrderProduct[] = [];
    let subTotal = 0;

    for (const item of cart.products) {
      const product = await this.productRepository.findById(
        item.productId.toString(),
      );
      if (!product) {
        throw new NotFoundException(
          `Product ${item.productId.toString()} not found`,
        );
      }
      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Product ${product.name} is out of stock (available: ${product.stock})`,
        );
      }

      const finalPrice = Number((product.finalPrice * item.quantity).toFixed(2));
      subTotal += finalPrice;

      orderProducts.push({
        name: product.name,
        productId: product._id,
        quantity: item.quantity,
        unitPrice: product.finalPrice,
        finalPrice,
      });
    }

    let couponId: Types.ObjectId | undefined;
    let discountAmount = 0;

    if (dto.couponCode) {
      const coupon = await this.couponRepository.findOne({
        code: dto.couponCode.trim().toUpperCase(),
      });
      if (!coupon) {
        throw new NotFoundException('Invalid coupon code');
      }

      const now = new Date();
      if (now < coupon.fromDate || now > coupon.toDate) {
        throw new BadRequestException('Coupon is expired or not active yet');
      }

      const alreadyUsed = coupon.usedBy?.some(
        (id) => id.toString() === userId,
      );
      if (alreadyUsed) {
        throw new BadRequestException('Coupon already used by this user');
      }

      couponId = coupon._id;
      discountAmount = Number(((subTotal * coupon.amount) / 100).toFixed(2));

      await this.couponRepository.update(coupon._id.toString(), {
        $push: { usedBy: new Types.ObjectId(userId) },
      });
    }

    const totalPrice = Number((subTotal - discountAmount).toFixed(2));
    const paymentMethod = dto.paymentMethod || PaymentMethod.CASH;

    const order = await this.orderRepository.create({
      userId: new Types.ObjectId(userId),
      address: dto.address,
      phone: dto.phone,
      note: dto.note,
      products: orderProducts,
      couponId,
      subTotal: Number(subTotal.toFixed(2)),
      discountAmount,
      totalPrice,
      paymentMethod,
      status:
        paymentMethod === PaymentMethod.CASH
          ? OrderStatus.PLACED
          : OrderStatus.PENDING,
    });

    for (const item of orderProducts) {
      const product = await this.productRepository.findById(
        item.productId.toString(),
      );
      if (product) {
        await this.productRepository.update(item.productId.toString(), {
          stock: product.stock - item.quantity,
        });
      }
    }

    await this.cartRepository.clear(userId);
    return order;
  }

  async createCheckoutSession(orderId: string, user: any) {
    const order = await this.orderRepository.findOne({
      _id: new Types.ObjectId(orderId),
      userId: new Types.ObjectId(user._id.toString()),
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.paymentMethod !== PaymentMethod.CARD) {
      throw new BadRequestException('Order payment method is not card');
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Order cannot be paid in its current state');
    }

    const lineItems = order.products.map((item) => ({
      price_data: {
        currency: 'egp',
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.unitPrice * 100),
      },
      quantity: item.quantity,
    }));

    const discounts: { coupon: string }[] = [];
    if (order.couponId) {
      const coupon = await this.couponRepository.findById(
        order.couponId.toString(),
      );
      if (coupon) {
        const stripeCoupon = await this.stripeService.createCoupon(
          coupon.amount,
        );
        discounts.push({ coupon: stripeCoupon.id });
      }
    }

    const session = await this.stripeService.createCheckoutSession({
      customerEmail: user.email,
      metadata: { orderId: order._id.toString() },
      lineItems,
      discounts,
    });

    await this.orderRepository.update(order._id.toString(), {
      checkoutSessionId: session.id,
    });

    return {
      url: session.url || '',
      sessionId: session.id,
    };
  }

  async handleWebhook(payload: Buffer | string, signature: string) {
    const event = this.stripeService.constructWebhookEvent(payload, signature);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any;
      const orderId = session.metadata?.orderId;
      if (orderId) {
        await this.orderRepository.update(orderId, {
          status: OrderStatus.PAID,
          paymentIntentId: session.payment_intent as string,
          paidAt: new Date(),
        });
      }
    }

    return { received: true };
  }

  async confirmOrderPaid(orderId: string, paymentIntentId?: string) {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return await this.orderRepository.update(orderId, {
      status: OrderStatus.PAID,
      paymentIntentId: paymentIntentId || order.paymentIntentId || 'pi_manual_confirmed',
      paidAt: new Date(),
    });
  }

  async cancelOrder(orderId: string, user: any) {
    const order = await this.orderRepository.findOne({
      _id: new Types.ObjectId(orderId),
      userId: new Types.ObjectId(user._id.toString()),
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (
      order.status === OrderStatus.CANCELED ||
      order.status === OrderStatus.DELIVERED ||
      order.status === OrderStatus.SHIPPED
    ) {
      throw new BadRequestException(
        `Cannot cancel order with status ${order.status}`,
      );
    }

    let newStatus = OrderStatus.CANCELED;
    if (order.status === OrderStatus.PAID && order.paymentIntentId) {
      await this.stripeService.refundPayment(order.paymentIntentId);
      newStatus = OrderStatus.REFUNDED;
    }

    for (const item of order.products) {
      const product = await this.productRepository.findById(
        item.productId.toString(),
      );
      if (product) {
        await this.productRepository.update(item.productId.toString(), {
          stock: product.stock + item.quantity,
        });
      }
    }

    return await this.orderRepository.update(orderId, {
      status: newStatus,
      canceledAt: new Date(),
    });
  }

  async findUserOrders(userId: string) {
    return await this.orderRepository.findAll({
      userId: new Types.ObjectId(userId),
    });
  }

  async findAll() {
    return await this.orderRepository.findAll();
  }

  async findById(id: string) {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }
}
