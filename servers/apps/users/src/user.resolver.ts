import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'
import { UsersService } from './users.service'
import { ActivationResponse, RegisterResponse } from './types/user.type'
import { ActivationDto, RegisterDto } from './dto/user.dto'
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
    const { activationToken } = await this.usersService.register(
      payload,
      context.res
    )
    return { activationToken }
  }

  @Mutation(() => ActivationResponse)
  async activateUser(
    @Args('payload') payload: ActivationDto,
    @Context() context: { res: Response }
  ) {
    return await this.usersService.activateUser(payload, context.res)
  }

  @Query(() => [User])
  async users() {
    return this.usersService.getUsers()
  }
}
