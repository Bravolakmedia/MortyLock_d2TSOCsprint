import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, IsNotEmpty, Length }  from "class-validator";

export class LoginDto {
    @ApiProperty()
    @IsEmail()
    @IsNotEmpty({ message: 'Email is required'})
    email: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: 'Password is required'})
    @Length(6, 20,{ message: 'Password must be between 6 to 20 characters.'})
    password: string;
  }