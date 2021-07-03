import { Module } from '@nestjs/common';
import { JSMiniServerService } from './services/JSMiniServer.service';

@Module({
  exports: [JSMiniServerService],
  providers: [JSMiniServerService],
})
export class MiniServerModule {}
