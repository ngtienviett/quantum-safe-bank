import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { BankAccountService } from 'src/bank-account/bank-account.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private bankAccountService: BankAccountService,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        phone_number: registerUserDto.phone_number,
        country_code: registerUserDto.country_code,
      },
    });

    if (user) {
      throw new HttpException('Phone number is existed', HttpStatus.FOUND);
    }

    const hashPassword = await this.hashPassword(registerUserDto.password);
    const res = await this.userRepository.save({
      ...registerUserDto,
      password: hashPassword,
    });

    await this.bankAccountService.createBankAccount(res.id, {
      is_primary: true,
      user: res,
      user_id: res.id,
    });

    return res;
  }

  async login(loginUserDto: LoginUserDto): Promise<any> {
    const user = await this.userRepository.findOne({
      where: {
        phone_number: loginUserDto.phone_number,
        country_code: loginUserDto.country_code,
      },
    });

    if (!user) {
      throw new HttpException(
        'Phone number is not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    const isValidPassword = bcrypt.compareSync(
      loginUserDto.password,
      user.password,
    );

    if (!isValidPassword) {
      throw new HttpException('Password is not correct', HttpStatus.FORBIDDEN);
    }

    const payload = {
      id: user.id,
      phone_number: user.phone_number,
      country_code: user.country_code,
    };

    const res = await this.generateToken(payload);

    return { ...user, ...res };
  }

  async refreshToken(refresh_token: string): Promise<any> {
    try {
      const user = await this.jwtService.verifyAsync(refresh_token, {
        secret: this.configService.get<string>('SECRET'),
      });

      const existToken = await this.userRepository.findOneBy({
        phone_number: user.phone_number,
        refresh_token,
      });

      if (existToken) {
        return this.generateToken({
          id: user.id,
          phone_number: user.phone_number,
          country_code: user.country_code,
        });
      } else {
        throw new HttpException(
          'Refresh token is not valid',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      throw new HttpException(
        'Refresh token is not valid',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const hash = await bcrypt.hash(password, salt);

    return hash;
  }

  private async generateToken(payload: {
    id: number;
    phone_number: string;
    country_code: string;
  }) {
    const access_token = await this.jwtService.signAsync(payload);
    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('SECRET'),
      expiresIn: this.configService.get<string>('EXP_IN_REFRESH_TOKEN'),
    });

    this.userRepository.update(
      {
        phone_number: payload.phone_number,
        country_code: payload.country_code,
      },
      { refresh_token: refresh_token },
    );
    return { access_token, refresh_token };
  }
}
