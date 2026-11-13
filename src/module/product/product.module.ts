import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductResolver } from './product.resolver';
import { ProductModel } from '../../database/model/product.model';
import { ProductRepository } from '../../database/repository/product.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [ProductModel, AuthModule],
  controllers: [ProductController],
  providers: [ProductService, ProductResolver, ProductRepository],
  exports: [ProductService, ProductRepository],
})
export class ProductModule {}
