import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'
import { UsersService } from './users.service'
import { RegisterResponse } from './types/user.type'
import { RegisterDto } from './dto/user.dto'
import { User } from './entities/user.entity'
import { Response } from 'express'

@Resolver('User')
export class UserResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => RegisterResponse)
  async register(
    @Args('payload') payload: RegisterDto,
    @Context() context: { res: Response }
  ) {
    return await this.usersService.register(payload, context.res)
  }

  @Query(() => [User])
  async users() {
    return this.usersService.getUsers()
  }
}
