import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../database/repository/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getProfile(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, ...result } = user.toObject();
    return result;
  }

  async updateProfile(userId: string, data: { name?: string; phone?: string; image?: string }) {
    const updatedUser = await this.userRepository.update(userId, {
      ...data,
      updatedAt: new Date(),
    });

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    const { password, ...result } = updatedUser.toObject();
    return result;
  }

  async getAllUsers() {
    const users = await this.userRepository.findAll();
    return users.map((u) => {
      const { password, ...result } = u.toObject();
      return result;
    });
  }

  async deactivateUser(userId: string) {
    const updated = await this.userRepository.update(userId, {
      deletedAt: new Date(),
    });

    if (!updated) {
      throw new NotFoundException('User not found');
    }

    return { message: 'User deactivated successfully' };
  }
}
