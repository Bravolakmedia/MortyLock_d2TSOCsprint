import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class CreateUserDto {
    @ApiProperty()
    @IsEmail()
    @IsNotEmpty({ message: 'Enter your email address.'})
    email: string;
    
    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: 'Enter your username.'})
    username: string;
    
    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: 'Enter your password.'})
    @Length(6, 20, {  message: 'Password must be between 6 to 20 characters.'})
    password: string;
  }
