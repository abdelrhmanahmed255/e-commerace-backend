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
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthGuard } from '../../common/guard/auth.guard';
import { ParseMongoIdPipe } from '../../common/pipe/parse-mongo-id.pipe';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() dto: CreateCategoryDto, @Req() req: any) {
    return this.categoryService.create(dto, req.user._id);
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findById(@Param('id', ParseMongoIdPipe) id: string) {
    return this.categoryService.findById(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() dto: UpdateCategoryDto,
    @Req() req: any,
  ) {
    return this.categoryService.update(id, dto, req.user._id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.categoryService.remove(id);
  }
}
