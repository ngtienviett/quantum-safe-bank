import { IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  phone_number: string;

  @IsNotEmpty()
  country_code: string;

  @IsNotEmpty()
  password: string;
}
