import {
  Controller,
  HttpStatus,
  Post,
  HttpCode,
  Body,
  UsePipes,
  HttpException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from 'src/Dto/auth/register.dto';
import { AuthorizationDTO } from 'src/Dto/auth/authorization.dto';
import { PhoneValidationPipe } from 'src/pipes/auth/phone-validation.pipe';
import { VerificationDTO } from 'src/Dto/auth/verification.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body('phoneNumber', PhoneValidationPipe) dto: RegisterDTO) {
    return this.authService.register(dto);
  }

  @Post('authorization')
  @HttpCode(HttpStatus.OK)
  async authorization(@Body('phoneNumber', PhoneValidationPipe) phoneNumber: string) {
    const dto: AuthorizationDTO = {phoneNumber}
    return this.authService.authorization(dto);
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  async verify(
    @Body('phoneNumber', PhoneValidationPipe) phoneNumber: string,
    @Body('code') code: string,
  ) {
    try {
      const dto: VerificationDTO = {phoneNumber, code};
      return await this.authService.verifyAccount(dto);
    } catch (error) {
      // Логируем ошибку для отладки
      console.error('Verify endpoint error:', error);

      // Возвращаем понятную ошибку
      throw new HttpException(
        {
          statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Внутренняя ошибка сервера',
          error: error.name || 'InternalServerError',
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
