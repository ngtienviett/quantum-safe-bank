import { IsNotEmpty } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class CreateBankAccountDto {
  @IsNotEmpty()
  is_primary: boolean;

  user: User;

  @IsNotEmpty()
  user_id: number;
}
