import { Injectable } from '@nestjs/common';
import { UserDataRequestDTO } from 'src/Dto/user/UserDataRequest.dto';
import { PrismaService } from 'src/Prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma:PrismaService){}
  getUserData(id: number ) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: false,
        firstname: true,
        lastname: true,
        avatar: true,
        phoneNumber: true,
        cartId: false,
        createdAt: true,
        updatedAt: false
      }
    });
  };
}
