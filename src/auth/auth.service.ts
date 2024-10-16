import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service'; // Import UserService to handle user database interactions
import { CreateUserDto } from '../user/create-user.dto'; // Assuming you have a CreateUserDto for registration

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService, // Inject UserService for database operations
  ) {}

  // Validate user by comparing password
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findUserByEmail(email); // Fetch user from DB

    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user; // Omit password from result
      return { userId: user.id, email: user.email };
    }

    return null; // Return null if validation fails
  }

  // User login method
  async login(email: string, password: string) {
    const user = await this.validateUser(email, password); // Validate user and get user details
  if (!user) {
    throw new UnauthorizedException(); // Handle invalid login
  }
    console.log(user); // Log to check the user object
    const payload = { userId: user.userId, email: user.email }; // Use user.id, assuming that's the unique identifier
    return {
      access_token: this.jwtService.sign(payload), // Generate JWT token
    };
  }

  // Registration method
  async register(userDto: CreateUserDto) {
    // Check if the user already exists
    const existingUser = await this.userService.findUserByEmail(userDto.email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }
    // Hash user password before saving
    const hashedPassword = await bcrypt.hash(userDto.password, 10);

    // Create user in the database via UserService
    const newUser = await this.userService.createUser({
      ...userDto,
      password: hashedPassword, // Save the hashed password
    });
    // Generate JWT token for the new user
    const payload = { email: newUser.email, sub: newUser.id };
    return {
      access_token: this.jwtService.sign(payload), // Return JWT token after registration
    };
  }
}
