import { Module } from '@nestjs/common';
import { MailGunService } from './services/mailGun.service';
import { SendGridEmailService } from './services/sendGrid.service';

@Module({
  providers: [SendGridEmailService, MailGunService],
  exports: [SendGridEmailService, MailGunService],
})
export class EmailModule {}
