import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/users.schema';
import { CreateUserDto } from './dtos/CreateUser.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async addUser(createUserDto: CreateUserDto): Promise<User> {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(createUserDto.password, saltOrRounds);
    const createdUser = new this.userModel({
      ...createUserDto,
      password: hash,
    });
    return await createdUser.save();
  }

  async findOneUserByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async findOneUserById(id: string) {
    return this.userModel.findById(id);
  }
}
