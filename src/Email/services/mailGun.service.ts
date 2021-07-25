import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvVariable } from 'src/common/interfaces/EnvVariable.interface';
import { IMessage, ISendMail, TemplateName } from './mail.base.service';
import * as mailGun from 'mailgun-js';
import * as emailTemplates from '../email.template';

@Injectable()
export class MailGunService implements ISendMail {
  private readonly API_KEY: string;
  private readonly mailGunInstance: mailGun.Mailgun;

  constructor(private configService: ConfigService<EnvVariable>) {
    this.API_KEY = this.configService.get('MAILGUN_API_KEY');
    this.mailGunInstance = mailGun({
      apiKey: this.API_KEY,
      domain: 'schoolx.xyz',
    });
  }

  sendMailWithCode(config: {
    templateName: TemplateName;
    messageConfig: IMessage;
    code: string;
  }) {
    console.log(this.API_KEY);
    const { templateName, messageConfig, code } = config;
    const templateSelected = emailTemplates[templateName];
    let replacedStr = '';

    if (templateName === 'TEMP_RESET_PASSWORD') {
      replacedStr = templateSelected.replace('%CODE%', code);
    }
    const data = {
      ...messageConfig,
      html: replacedStr,
    };

    return this.mailGunInstance.messages().send(data);
  }
}
