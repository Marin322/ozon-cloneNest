import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma:PrismaService){}
  getAll() {
    return this.prisma.product.findMany();
  }
}
