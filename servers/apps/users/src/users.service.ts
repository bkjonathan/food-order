import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { ActivationDto, LoginDto, RegisterDto } from './dto/user.dto'
import { PrismaService } from '../../../prisma/prisma.service'
import { Response } from 'express'
import { compareSync, hash } from 'bcrypt'
import { EmailService } from './email/email.service'
import { User } from '@prisma/client'
import { TokenSenderService } from './utils/tokenSender.service'

type UserType = Omit<
  User,
  'id' | 'role' | 'avatarId' | 'createdAt' | 'updatedAt'
>
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

    const hashedPassword = await hash(password, 10)
    const user: UserType = {
      name,
      email,
      phoneNumber,
      password: hashedPassword,
      address
    }
    const activation = await this.createActivationToken(user)

    const { activationCode, activationToken } = activation

    await this.emailService.sendActivationEmail({
      email,
      subject: 'Account Activation',
      template: './activation-mail',
      name,
      activationCode
    })

    // await this.prismaService.user.create({
    //   data: {
    //     name,
    //     email,
    //     password: hashedPassword,
    //     phoneNumber,
    //     address
    //   }
    // })

    return {
      activationToken,
      response
    }
  }

  async createActivationToken(user: UserType) {
    const activationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString()
    const activationToken = this.jwtService.sign(
      {
        user,
        activationCode
      },
      {
        secret: this.configService.get<string>('ACTIVATION_SECRET'),
        expiresIn: '5m'
      }
    )
    return { activationToken, activationCode }
  }

  async activateUser(activationDto: ActivationDto, response: Response) {
    const { activationToken, activationCode } = activationDto

    const newUser: { user: User; activationCode: string } =
      this.jwtService.verify(activationToken, {
        secret: this.configService.get<string>('ACTIVATION_SECRET')
      })

    if (newUser.activationCode !== activationCode) {
      throw new BadRequestException('Invalid activation code')
    }
    const { name, email, password, phoneNumber, address } = newUser.user

    const existingUser = await this.prismaService.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      throw new BadRequestException('User already exists')
    }

    const user = await this.prismaService.user.create({
      data: {
        name,
        email,
        password,
        phoneNumber,
        address
      }
    })
    return { user, response }
  }

  async login(payload: LoginDto) {
    const { email, password } = payload

    const user = await this.prismaService.user.findUnique({
      where: { email }
    })

    if (!user) {
      throw new BadRequestException('User not found')
    }
    if (!compareSync(password, user.password)) {
      throw new BadRequestException('Invalid password')
    }

    const tokenSender = new TokenSenderService(
      this.configService,
      this.jwtService
    )
    return await tokenSender.sendToken(user)
  }

  async getUsers() {
    return this.prismaService.user.findMany({})
  }
}
