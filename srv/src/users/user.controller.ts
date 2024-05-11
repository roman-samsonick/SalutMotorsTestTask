import { Controller, Get, Query } from '@nestjs/common';
import { UsersEntity } from './users.entity';
import { UserService } from './users.service';

export interface IUserPageMeta {
  first: string;
  prev: string | null;
  next: string | null;
  last: string;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getUsers(@Query('page') page: number): Promise<{ data: UsersEntity[]; meta: IUserPageMeta }> {
    return await this.userService.findAll(page);
  }
}
