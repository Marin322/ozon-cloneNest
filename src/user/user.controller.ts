import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDataRequestDTO } from 'src/Dto/user/UserDataRequest.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getUserData(@Param('id') id: string) {
    return this.userService.getUserData(parseInt(id));
  }
}
