import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'
import { UsersService } from './users.service'
import {
  ActivationResponse,
  LoginResponse,
  RegisterResponse
} from './types/user.type'
import { ActivationDto, LoginDto, RegisterDto } from './dto/user.dto'
import { User } from './entities/user.entity'
import { Response } from 'express'
import { AuthGuard } from './guards/auth.guard'
import { UseGuards } from '@nestjs/common'

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

  @Mutation(() => LoginResponse)
  async login(@Args('payload') payload: LoginDto): Promise<LoginResponse> {
    return await this.usersService.login(payload)
  }

  @Query(() => LoginResponse)
  @UseGuards(AuthGuard)
  async authMe(@Context() context: { req: any }) {
    return {
      user: context.req.user,
      accessToken: context.req.accessToken,
      refreshToken: context.req.refreshToken
    }
  }
  @Query(() => [User])
  async users() {
    return this.usersService.getUsers()
  }
}
