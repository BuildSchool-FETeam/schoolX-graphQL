import { EnvVariable } from 'src/common/interfaces/EnvVariable.interface';
import * as emailTemplate from './email.template';
import * as sgMail from '@sendgrid/mail';
import { MailService } from '@sendgrid/mail';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

export interface IMessage {
  to: string;
  from: string;
  subject: string;
}

type TemplateName = keyof typeof emailTemplate;

@Injectable()
export class EmailService {
  private sendGridAPIKey: string;
  private sgMail: MailService;

  readonly emailSenderDefault: string;

  constructor(private configService: ConfigService<EnvVariable>) {
    this.sendGridAPIKey = this.configService.get('SENDGRID_API_KEY');
    this.emailSenderDefault = this.configService.get('EMAIL_SENDER');
    this.sgMail = sgMail;
  }

  sendMail(config: {
    messageConfig: IMessage;
    templateName: TemplateName;
    code: string;
  }) {
    const { messageConfig, templateName, code } = config;
    const templateSelected = emailTemplate[templateName];

    if (templateName === 'TEMP_RESET_PASSWORD') {
      templateSelected.replace('%CODE%', code);
    }

    this.sgMail.setApiKey(this.sendGridAPIKey);

    const message = {
      ...messageConfig,
      html: templateSelected,
    };

    return sgMail.send(message);
  }
}
