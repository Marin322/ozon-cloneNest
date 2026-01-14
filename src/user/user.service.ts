import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  getAll() {
    return [
      {
        name: 'Okak',
        age: 23,
      },
      {
        name: 'Okak2',
        age: 32,
      },
    ];
  }
}
