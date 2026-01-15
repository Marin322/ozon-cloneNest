import { Controller, HttpStatus, Post, HttpCode, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from 'src/Dto/auth/register.dto';
import { AuthorizationDTO } from 'src/Dto/auth/authorization.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterDTO) {
    return this.authService.register(dto);
  };

  @Post('authorization')
  @HttpCode(HttpStatus.OK)
  async authorization(@Body() dto:AuthorizationDTO) {
    return this.authService.authorization(dto);
  };
};
