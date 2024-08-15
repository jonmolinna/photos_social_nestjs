import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { AuthGuard } from 'src/auth/auth.guard';

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

  @UseGuards(AuthGuard)
  @Get('/:email')
  async getFindUserByEmail(@Param('email') email: string, @Res() response) {
    const user = await this.userService.findOneUserByEmail(email);
    if (user) {
      return response.status(200).json({
        email: user.email,
        name: user.name,
        _id: user._id,
      });
    } else {
      return response.status(404).json({
        message: 'No existe el usuario',
      });
    }
  }
}
