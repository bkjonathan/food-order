import { Injectable } from '@nestjs/common'
import { MailerService } from '@nestjs-modules/mailer'

type mailOptions = {
  subject: string
  email: string
  name: string
  activationCode: string
  template: string
}
@Injectable()
export class EmailService {
  constructor(private mailService: MailerService) {}

  async sendActivationEmail({
    name,
    subject,
    email,
    activationCode,
    template
  }: mailOptions) {
    await this.mailService.sendMail({
      to: email,
      subject,
      template,
      context: {
        name,
        activationCode
      }
    })
  }
}
