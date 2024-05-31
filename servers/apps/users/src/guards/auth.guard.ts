import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '../../../../prisma/prisma.service'
import { GqlExecutionContext } from '@nestjs/graphql'
import { TokenSenderService } from '../utils/tokenSender.service'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService
  ) {}
  async canActivate(context: ExecutionContext) {
    const graphqlContext = GqlExecutionContext.create(context)
    const { req } = graphqlContext.getContext()

    const { accesstoken: accessToken, refreshtoken: refreshToken } = req.headers

    if (!accessToken || !refreshToken) {
      throw new UnauthorizedException(
        'Access token or refresh token is missing'
      )
    }

    const decodedAccessToken = this.jwtService.verify(accessToken, {
      secret: this.configService.get('ACCESS_TOKEN_SECRET')
    })

    if (!decodedAccessToken) {
      throw new UnauthorizedException('Invalid access token')
    }

    await this.updateAccessToken(req)

    return true
  }

  private async updateAccessToken(req: any): Promise<void> {
    const { accesstoken: accessToken, refreshtoken: refreshToken } = req.headers
    const decodeRefreshToken = await this.jwtService.verify(refreshToken, {
      secret: this.configService.get('REFRESH_TOKEN_SECRET')
    })
    if (!decodeRefreshToken) {
      throw new UnauthorizedException('Invalid refresh token')
    }

    const user = await this.prismaService.user.findUnique({
      where: { id: decodeRefreshToken.id }
    })
    if (!user) {
      throw new UnauthorizedException('User not found')
    }

    const tokenSender = new TokenSenderService(
      this.configService,
      this.jwtService
    )
    const newToken = await tokenSender.sendToken(user)

    req.accessToken = newToken.accessToken
    req.refreshToken = newToken.refreshToken
    req.user = user
  }
}
