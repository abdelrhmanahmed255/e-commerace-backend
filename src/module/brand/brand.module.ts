import { Module } from '@nestjs/common';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';
import { BrandModel } from '../../database/model/brand.model';
import { BrandRepository } from '../../database/repository/brand.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [BrandModel, AuthModule],
  controllers: [BrandController],
  providers: [BrandService, BrandRepository],
  exports: [BrandService, BrandRepository],
})
export class BrandModule {}
