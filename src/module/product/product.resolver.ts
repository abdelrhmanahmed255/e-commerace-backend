import { Args, Context, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductType } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from '../../common/guard/auth.guard';

@Resolver(() => ProductType)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Query(() => [ProductType], { name: 'products' })
  findAll() {
    return this.productService.findAll();
  }

  @Query(() => ProductType, { name: 'product' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.productService.findById(id);
  }

  @Mutation(() => ProductType, { name: 'createProduct' })
  @UseGuards(AuthGuard)
  create(
    @Args('createProductInput') createProductInput: CreateProductDto,
    @Context() context: any,
  ) {
    return this.productService.create(createProductInput, context.req.user._id);
  }

  @Mutation(() => ProductType, { name: 'updateProduct' })
  @UseGuards(AuthGuard)
  update(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateProductInput') updateProductInput: UpdateProductDto,
    @Context() context: any,
  ) {
    return this.productService.update(id, updateProductInput, context.req.user._id);
  }

  @Mutation(() => ProductType, { name: 'removeProduct' })
  @UseGuards(AuthGuard)
  remove(@Args('id', { type: () => ID }) id: string) {
    return this.productService.remove(id);
  }
}
