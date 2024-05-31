import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { User } from '../entities/user.entity'

export class TokenSenderService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwt: JwtService
  ) {}

  private async createToken(user: User, secretKey: string, expiresIn: string) {
    return this.jwt.sign(
      { id: user.id },
      {
        secret: this.configService.get(secretKey),
        expiresIn: this.configService.get(expiresIn)
      }
    )
  }
  public async sendToken(user: User) {
    const accessToken = await this.createToken(
      user,
      'ACCESS_TOKEN_SECRET',
      'ACCESS_TOKEN_EXPIRATION'
    )
    const refreshToken = await this.createToken(
      user,
      'REFRESH_TOKEN_SECRET',
      'REFRESH_TOKEN_EXPIRATION'
    )

    return { user, accessToken, refreshToken }
  }
}
