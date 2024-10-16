// auth/auth.controller.ts
import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto'; // Assuming you create a Login DTO
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from 'src/user/create-user.dto';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  //User Registration endpoint
  @Post('signup')
  @ApiOperation({ summary: 'User signup' })
  @ApiResponse({ status: 201, description: 'User created' })
  async signUp(@Body() createUserDto :CreateUserDto) {
    return this.authService.register(createUserDto); // Updated to match your current AuthService method
  }

  // Login endpoint
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'User logged in' })
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password); // Pass both email and password
  if (!user) {
    throw new UnauthorizedException(); // Handle invalid login
  }
  return this.authService.login(user); // Now pass the user to the login method
  }
}

