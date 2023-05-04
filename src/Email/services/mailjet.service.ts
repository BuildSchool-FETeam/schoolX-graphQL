import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { EnvVariable } from 'src/common/interfaces/EnvVariable.interface'
import { IMessage, ISendMail, TemplateName } from './mail.base.service'
import * as emailTemplates from '../email.template'
import { Client } from 'node-mailjet'

@Injectable()
export class MailjetService implements ISendMail {
  private readonly API_KEY: string
  private readonly SECRET_KEY: string
  private readonly mailjet

  constructor(private configService: ConfigService<EnvVariable>) {
    this.API_KEY = this.configService.get('MAILJET_API_KEY')
    this.SECRET_KEY = this.configService.get('MAILJET_SECRET_KEY')
    this.mailjet = Client.apiConnect(this.API_KEY, this.SECRET_KEY)
  }

  async sendMailWithCode(config: {
    templateName: TemplateName
    messageConfig: IMessage
    code: string
  }) {
    const { templateName, messageConfig, code } = config
    const templateSelected = emailTemplates[templateName]
    let replacedStr = ''

    if (templateName === 'TEMP_RESET_PASSWORD') {
      replacedStr = templateSelected.replace('%CODE%', code)
    }
    const data = {
      From: { Email: messageConfig.from },
      To: [{ Email: messageConfig.to }],
      Subject: messageConfig.subject,
      HTMLPart: replacedStr,
    }
    this.mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [data],
    })
  }
}
