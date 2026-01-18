import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthorizationDTO } from 'src/Dto/auth/authorization.dto';
import { RegisterDTO } from 'src/Dto/auth/register.dto';
import { VerificationDTO } from 'src/Dto/auth/verification.dto';
import { PrismaService } from 'src/Prisma.service';
import { VerificationModule } from 'src/verification/verification.module';
import { VerificationService } from 'src/verification/verification.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly verificationService: VerificationService,
  ) {}

  async register(dto: RegisterDTO) {
    const existing = await this.prisma.user.findFirst({
      where: {
        phoneNumber: dto.phoneNumber,
      },
    });

    if (existing) {
      throw new ConflictException('Пользователь уже существует');
    }

    const user = await this.prisma.user.create({
      data: {
        phoneNumber: dto.phoneNumber,
      },
      select: {
        id: true,
      },
    });

    return {
      message: 'Пользователь успешно создан',
      user,
    };
  }

  async authorization(dto: AuthorizationDTO) {
    // const existing = await this.prisma.user.findFirst({
    //   where: {
    //     phoneNumber: dto.phoneNumber,
    //   },
    // });

    // if (!existing) {
    //   throw new NotFoundException({
    //     message: 'Аккаунта с этим номером телефона нет',
    //     phoneNumber: dto.phoneNumber,
    //     timestamp: new Date().toISOString(),
    //   });
    // }

    const { code } = await this.verificationService.createCode(dto.phoneNumber);
    return {
      authCode: code,
    };
  }

  async verifyAccount(dto: VerificationDTO) {
    const verify = await this.verificationService.verification(
      dto.phoneNumber,
      dto.code,
    );
    if (!verify) {
      return { success: false, message: 'Неверный код' };
    }

    const haveUser = await this.prisma.user.findFirst({
      where: { phoneNumber: dto.phoneNumber },
    });

    if (!haveUser) {
      const registerData: RegisterDTO = {
        phoneNumber: dto.phoneNumber,
      };
      const result = await this.register(registerData);
      return result.user.id;
    }

    const userId = await this.prisma.user.findUnique({
      where: { phoneNumber: dto.phoneNumber },
    });

    if (!userId) {
      throw new BadRequestException('Пользователя не существует');
    }

    return userId.id;
  }
}
