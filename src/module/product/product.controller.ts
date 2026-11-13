import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from '../../common/guard/auth.guard';
import { ParseMongoIdPipe } from '../../common/pipe/parse-mongo-id.pipe';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() dto: CreateProductDto, @Req() req: any) {
    return this.productService.create(dto, req.user._id);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findById(@Param('id', ParseMongoIdPipe) id: string) {
    return this.productService.findById(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() dto: UpdateProductDto,
    @Req() req: any,
  ) {
    return this.productService.update(id, dto, req.user._id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.productService.remove(id);
  }
}
