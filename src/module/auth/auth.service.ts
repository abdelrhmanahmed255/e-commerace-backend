import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UserRepository } from '../../database/repository/user.repository';
import { RedisService } from '../../common/services/redis.service';
import { SendEmailService } from '../../common/services/send-email.service';
import { TokenService } from '../../common/services/token.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { ConfirmOtpDto } from './dto/confirm-otp.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly redisService: RedisService,
    private readonly sendEmailService: SendEmailService,
    private readonly tokenService: TokenService,
  ) {}

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async signup(dto: SignUpDto) {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.userRepository.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      phone: dto.phone,
      isConfirmed: false,
    });

    const otp = this.generateOtp();
    await this.redisService.set(`otp:${dto.email}`, otp, 300); // 5 minutes

    await this.sendEmailService.sendOtpEmail(dto.email, otp);

    return {
      message: 'User registered successfully. Please verify your OTP sent to email',
      email: user.email,
      otpSimulation: process.env.NODE_ENV === 'dev' ? otp : undefined,
    };
  }

  async confirmOtp(dto: ConfirmOtpDto) {
    const cachedOtp = await this.redisService.get(`otp:${dto.email}`);
    if (!cachedOtp || cachedOtp !== dto.otp) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.isConfirmed = true;
    await user.save();

    await this.redisService.del(`otp:${dto.email}`);

    const payload = { id: user._id, email: user.email, role: user.role };
    const accessToken = this.tokenService.generateAccessToken(payload);
    const refreshToken = this.tokenService.generateRefreshToken(payload);

    return {
      message: 'Account confirmed successfully',
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async resendOtp(email: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isConfirmed) {
      throw new BadRequestException('Account is already confirmed');
    }

    const otp = this.generateOtp();
    await this.redisService.set(`otp:${email}`, otp, 300);
    await this.sendEmailService.sendOtpEmail(email, otp);

    return {
      message: 'A new OTP has been sent to your email',
      otpSimulation: process.env.NODE_ENV === 'dev' ? otp : undefined,
    };
  }

  async signin(dto: SignInDto) {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Invalid email or password');
    }

    if (!user.isConfirmed) {
      throw new BadRequestException('Please confirm your email first before logging in');
    }

    if (user.deletedAt) {
      throw new UnauthorizedException('Account has been deactivated');
    }

    const payload = { id: user._id, email: user.email, role: user.role };
    const accessToken = this.tokenService.generateAccessToken(payload);
    const refreshToken = this.tokenService.generateRefreshToken(payload);

    return {
      message: 'Logged in successfully',
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async refreshToken(dto: RefreshTokenDto) {
    const decoded = this.tokenService.verifyRefreshToken(dto.refreshToken);

    const user = await this.userRepository.findById(decoded.id);
    if (!user || user.deletedAt) {
      throw new UnauthorizedException('Invalid token or user not found');
    }

    const payload = { id: user._id, email: user.email, role: user.role };
    const newAccessToken = this.tokenService.generateAccessToken(payload);

    return {
      accessToken: newAccessToken,
    };
  }

  async forgetPassword(dto: ForgetPasswordDto) {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new NotFoundException('User not found with this email');
    }

    const otp = this.generateOtp();
    await this.redisService.set(`otp:forget:${dto.email}`, otp, 300);
    await this.sendEmailService.sendOtpEmail(dto.email, otp);

    return {
      message: 'Password reset OTP has been sent to your email',
      otpSimulation: process.env.NODE_ENV === 'dev' ? otp : undefined,
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const cachedOtp = await this.redisService.get(`otp:forget:${dto.email}`);
    if (!cachedOtp || cachedOtp !== dto.otp) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.password = await bcrypt.hash(dto.newPassword, 10);
    await user.save();

    await this.redisService.del(`otp:forget:${dto.email}`);

    return {
      message: 'Password has been reset successfully. You can now login with your new password',
    };
  }
}
