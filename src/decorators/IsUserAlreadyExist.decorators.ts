import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UsersService } from 'src/users/users.service';

@ValidatorConstraint({ name: 'IsUserAlreadyExist', async: true })
@Injectable()
export class IsUserAlreadyExist implements ValidatorConstraintInterface {
  constructor(private usersRepository: UsersService) {}

  async validate(email: string) {
    const user = await this.usersRepository.findOneUserByEmail(email);
    if (user) {
      return false;
    }
    return true;
  }
}
