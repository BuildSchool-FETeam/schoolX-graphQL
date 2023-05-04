import { Module } from '@nestjs/common'
import { MailjetService } from './services/mailjet.service'

@Module({
  providers: [MailjetService],
  exports: [MailjetService],
})
export class EmailModule {}
