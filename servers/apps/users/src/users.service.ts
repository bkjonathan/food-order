import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { LoginDto, RegisterDto } from './dto/user.dto'
import { PrismaService } from '../../../prisma/prisma.service'
import { Response } from 'express'
import { hash } from 'bcrypt'
import { EmailService } from './email/email.service'

@Injectable()
export class UsersService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly emailService: EmailService
  ) {}

  async register(payload: RegisterDto, response: Response) {
    const { name, email, password, phoneNumber, address } = payload
    const isEmailExist = await this.prismaService.user.findUnique({
      where: { email }
    })
    if (isEmailExist) {
      throw new Error('Email already exists')
    }

    const isPhoneNumberExist = await this.prismaService.user.findUnique({
      where: { phoneNumber }
    })

    if (isPhoneNumberExist) {
      throw new Error('Phone number already exists')
    }

    const user = {
      name,
      email,
      phoneNumber,
      address
    }
    const activationToken = await this.createActivationToken(user)

    const { token, activationCode } = activationToken

    await this.emailService.sendActivationEmail({
      email,
      subject: 'Account Activation',
      template: './activation-mail',
      name,
      activationCode
    })

    // const user = await this.prismaService.user.create({
    //   data: { name, email, password, phoneNumber, address }
    // })

    const hashedPassword = await hash(password, 10)

    return {
      user,
      response
    }
  }

  async createActivationToken(user) {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString()
    const token = this.jwtService.sign(
      {
        user,
        activationCode
      },
      { secret: this.configService.get<string>('ACTIVATION_SECRET') }
    )
    return { token, activationCode }
  }

  async activateAccount(token: string) {
    const { user, activationCode } = this.jwtService.verify(token, {
      secret: this.configService.get<string>('ACTIVATION_SECRET')
    })
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
