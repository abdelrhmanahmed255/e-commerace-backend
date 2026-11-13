import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryModel } from '../../database/model/category.model';
import { CategoryRepository } from '../../database/repository/category.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [CategoryModel, AuthModule],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository],
  exports: [CategoryService, CategoryRepository],
})
export class CategoryModule {}
