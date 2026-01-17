import {
  Controller,
  HttpStatus,
  Post,
  HttpCode,
  Body,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from 'src/Dto/auth/register.dto';
import { AuthorizationDTO } from 'src/Dto/auth/authorization.dto';
import { PhoneValidationPipe } from 'src/pipes/auth/phone-validation.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body('phoneNumber', PhoneValidationPipe) phoneNumber: string,
  ) {
    return this.authService.register(phoneNumber);
  }

  @Post('authorization')
  @HttpCode(HttpStatus.OK)
  async authorization(@Body() dto: AuthorizationDTO) {
    return this.authService.authorization(dto);
  }
}
