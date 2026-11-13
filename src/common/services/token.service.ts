import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  generateAccessToken(payload: Record<string, any>): string {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET || 'defaultAccessSecret',
      expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN || '1h') as any,
    });
  }

  generateRefreshToken(payload: Record<string, any>): string {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'defaultRefreshSecret',
      expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as any,
    });
  }

  verifyAccessToken(token: string): any {
    try {
      return this.jwtService.verify(token, {
        secret: process.env.JWT_ACCESS_SECRET || 'defaultAccessSecret',
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }

  verifyRefreshToken(token: string): any {
    try {
      return this.jwtService.verify(token, {
        secret: process.env.JWT_REFRESH_SECRET || 'defaultRefreshSecret',
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
