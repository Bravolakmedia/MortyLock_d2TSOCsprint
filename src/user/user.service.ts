import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service'; // Assuming you're using Prisma for DB

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
      select: { id: true, email: true, password: true },
    });
  }

  // Create new user
  async createUser(userData: any) {
    return this.prisma.user.create({
      data: userData,
    });
  }
}
