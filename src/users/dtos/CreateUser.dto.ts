import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  Validate,
} from 'class-validator';
import { IsUserAlreadyExist } from 'src/decorators/IsUserAlreadyExist.decorators';

export class CreateUserDto {
  @IsString({ message: 'El nombre es una cadena' })
  @IsNotEmpty({ message: 'Ingrese un nombre del usuario' })
  name: string;

  @IsEmail({}, { message: 'Ingrese un email válido' })
  @Validate(IsUserAlreadyExist, { message: 'Ya existe el usuario' })
  email: string;

  @MinLength(5, { message: 'La contraseña debe tener más de 5 caracteres' })
  password: string;
}
