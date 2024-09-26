import { Controller, Post, Body} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from  './create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  
  @Post('create')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);  // Calls `createUser` from UserService
  }
}
