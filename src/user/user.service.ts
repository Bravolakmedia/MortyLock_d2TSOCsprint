import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service'; // Assuming you're using Prisma for DB
import { CreateUserDto } from './create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllUsers() {
    return this.prisma.user.findMany();
  }

  // Update this method to find the user by email
  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },  // Email is the unique field here
    });
  }

  // Create new user
  async createUser(userData: any) {
    return this.prisma.user.create({
      data: userData,
    });
  }
}
