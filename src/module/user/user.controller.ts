import {
  Body,
  Controller,
  Delete,
  Get,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../../common/guard/auth.guard';
import { Roles, RolesGuard } from '../../common/guard/roles.guard';
import { UserRole } from '../../common/interface/user.interface';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @UseGuards(AuthGuard)
  getProfile(@Req() req: any) {
    return this.userService.getProfile(req.user._id);
  }

  @Put('profile')
  @UseGuards(AuthGuard)
  updateProfile(
    @Req() req: any,
    @Body() body: { name?: string; phone?: string; image?: string },
  ) {
    return this.userService.updateProfile(req.user._id, body);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Delete('deactivate')
  @UseGuards(AuthGuard)
  deactivate(@Req() req: any) {
    return this.userService.deactivateUser(req.user._id);
  }
}
