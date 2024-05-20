import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { LoginDto, RegisterDto } from './dto/user.dto'
import { User } from './entities/user.entity'
import { PrismaService } from '../../../prisma/prisma.service'
import { Response } from 'express'

@Injectable()
export class UsersService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService
  ) {}

  async register(payload: RegisterDto, response: Response) {
    console.log(payload)
    const { name, email, password } = payload
    const user = await this.prismaService.user.create({
      data: { name, email, password }
    })

    return {
      user,
      response
    }
  }

  async login(payload: LoginDto) {
    const { email, password } = payload
    const user = {
      id: '1',
      name: 'John Doe',
      email,
      password: 'password',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  async getUsers() {
    return this.prismaService.user.findMany({})
  }
}
