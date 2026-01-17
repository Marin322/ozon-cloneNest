import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthorizationDTO } from 'src/Dto/auth/authorization.dto';
import { RegisterDTO } from 'src/Dto/auth/register.dto';
import { PrismaService } from 'src/Prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(phone: string) {
    const existing = await this.prisma.user.findFirst({
      where: {
        phoneNumber: phone,
      },
    });

    if (existing) {
      throw new ConflictException('Пользователь уже существует');
    }

    const user = await this.prisma.user.create({
      data: {
        phoneNumber: phone,
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
    const existing = await this.prisma.user.findFirst({
      where: {
        phoneNumber: dto.phoneNumber,
      },
    });

    if (!existing) {
        throw new NotFoundException({
            message: 'Аккаунта с этим номером телефона нет',
            phoneNumber: dto.phoneNumber,
            timestamp: new Date().toISOString(),
          });
    }

    return {
      message: 'Успешный вход в аккаунт',
      existing,
    };
  }
}
