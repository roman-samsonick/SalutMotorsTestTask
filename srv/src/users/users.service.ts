import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserPageMeta } from './user.controller';
import { UsersEntity } from './users.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UsersEntity)
    private usersRepo: Repository<UsersEntity>,
  ) {}

  // get list of all users
  async findAll(page = 1): Promise<{
    data: UsersEntity[];
    meta: IUserPageMeta;
  }> {
    const limit = 10;
    const [data, total] = await this.usersRepo.findAndCount({
      skip: page > 0 ? (page - 1) * limit : 0,
      take: limit,
    });
    const totalPages = Math.ceil(total / limit);
    return {
      meta: {
        first: `?page=1`,
        prev: page > 1 ? `?page=${page - 1}` : null,
        next: page < totalPages ? `?page=${Number.parseInt(String(page)) + 1}` : null,
        last: `?page=${totalPages}`,
        total,
        page,
        limit,
        totalPages,
      },
      data,
    };
  }
}
