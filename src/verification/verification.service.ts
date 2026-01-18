import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/Prisma.service';
import { VerificationDTO } from 'src/Dto/auth/verification.dto';
import { PrismaClient, VerificationCode } from '@prisma/client';

@Injectable()
export class VerificationService {
    constructor(private readonly prisma: PrismaService) {}

    /**
     * Generate 4-digits code
     * @param length 
     * @returns {Promise<code>}
     */

    private generateCode(length = 4): string {
        let code: number;
        const minChar: number = 1000;
        const maxChar: number = 9999;
        code = Math.floor(Math.random() * (maxChar - minChar + 1)) + minChar;
        return code.toString();
    };

    private sendSMS(code: string) {
        return code;
    }

    /**
     * Create 4-digits code in BD
     * @param phone 
     * @returns 
     */

    async createCode(phone: string): Promise<{code: string}> {
        const code = this.generateCode();
        const expireAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await this.prisma.verificationCode.deleteMany({
            where: { phone }
        });

        await this.prisma.verificationCode.create({
            data: {
                phone,
                code: code.toString(),
                expireAt
            }
        });

        this.sendSMS(code);

        return {code};
    };

    /**
     * Verification code in BD
     * @param phone
     * @param inputCode 
     * @returns boolean type
     */

    async verification(phone: string, inputCode: string): Promise<boolean> {
        const verification = await this.prisma.verificationCode.findFirst({
            where: { phone }
        });
        if (!verification) {
            throw new NotFoundException('Кода не существует или он истёк');
        };
        if (verification.expireAt < new Date()) {
            await this.prisma.verificationCode.delete({
                where: {
                    id: verification.id
                }
            });
            throw new BadRequestException('Истёк срок кода');
        };
        if (verification.attempts <= 0) {
            await this.prisma.verificationCode.delete({
                where: {
                    id: verification.id
                }
            });
            throw new BadRequestException('Превышено количество попыток');
        };
        await this.prisma.verificationCode.update({
            where: {id: verification.id},
            data: {attempts: {decrement: 1}}
        });
        if (inputCode != verification.code) {
            throw new BadRequestException('Неверный код');
        };
        await this.prisma.verificationCode.delete({
            where: {
                id: verification.id
            }
        });
        return true;
    };
};
