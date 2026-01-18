import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/Prisma.service';
import { VerificationService } from 'src/verification/verification.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, VerificationService ,PrismaService],
})
export class AuthModule {}
