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
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { AuthGuard } from '../../common/guard/auth.guard';
import { ParseMongoIdPipe } from '../../common/pipe/parse-mongo-id.pipe';

@Controller('brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() dto: CreateBrandDto, @Req() req: any) {
    return this.brandService.create(dto, req.user._id);
  }

  @Get()
  findAll() {
    return this.brandService.findAll();
  }

  @Get(':id')
  findById(@Param('id', ParseMongoIdPipe) id: string) {
    return this.brandService.findById(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() dto: UpdateBrandDto,
    @Req() req: any,
  ) {
    return this.brandService.update(id, dto, req.user._id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.brandService.remove(id);
  }
}
