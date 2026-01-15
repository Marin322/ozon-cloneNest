import { ConflictException, Injectable } from '@nestjs/common';
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

        // const user = await this.prisma.user.create({
            
        // })
    }
}
