import { Module } from '@nestjs/common'
import { MailGunService } from './services/mailGun.service'

@Module({
  providers: [MailGunService],
  exports: [MailGunService],
})
export class EmailModule {}
