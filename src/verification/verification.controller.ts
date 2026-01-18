import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { VerificationDTO } from 'src/Dto/auth/verification.dto';

@Controller('verification')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Post('verification')
  @HttpCode(HttpStatus.OK)
  async verification(@Body() dto: VerificationDTO) {
    return this.verificationService.verification(dto.phoneNumber, dto.code);
  };
}
