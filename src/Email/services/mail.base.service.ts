import * as emailTemplate from '../email.template';

export interface IMessage {
  to: string;
  from: string;
  subject: string;
}

export type TemplateName = keyof typeof emailTemplate;

export interface ISendMail {
  sendMailWithCode(config: {
    templateName: TemplateName;
    messageConfig: IMessage;
    code: string;
  }): DynamicObject;
}
