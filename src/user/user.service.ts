import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/Prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma:PrismaService){}
  getAll() {
    return this.prisma.user.findMany();
  }
}
