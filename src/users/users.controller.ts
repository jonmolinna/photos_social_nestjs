import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/CreateUser.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('create')
  async createUser(@Res() res, @Body() createUserDto: CreateUserDto) {
    await this.userService.addUser(createUserDto);
    return res.status(HttpStatus.CREATED).json({
      message: 'Usuario creado exitosamente',
    });
  }
}
