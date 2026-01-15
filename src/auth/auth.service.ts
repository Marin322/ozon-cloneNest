import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { AuthorizationDTO } from 'src/Dto/auth/authorization.dto';
import { RegisterDTO } from 'src/Dto/auth/register.dto';
import { PrismaService } from 'src/Prisma.service';

@Injectable()
export class AuthService {
    constructor(private readonly prisma:PrismaService){}

    async register(dto: RegisterDTO) {
        const existing = await this.prisma.user.findFirst({
            where: {
                phoneNumber: dto.phoneNumber
            }
        });

        if (existing) {
            throw new ConflictException('Пользователь уже существует');
        };

        const user = await this.prisma.user.create({
            data: {
                phoneNumber: dto.phoneNumber
            },
            select: {
                id: true,
                lastname: true,
                firstname: true,
                phoneNumber: true
            }
        });

        return {
            message: 'Пользователь успешно создан',
            user
        };
    };

    async authorization(dto: AuthorizationDTO) {
        const existing = await this.prisma.user.findFirst({
            where: {
                phoneNumber: dto.phoneNumber
            }
        });

        if (!existing) {
            throw new NotFoundException('Аккаунта с этим номером телефона нет');
        };

        return {
            message: 'Успешный вход в аккаунт',
            existing
        };
    };
}
