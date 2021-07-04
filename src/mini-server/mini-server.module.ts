import { Module } from '@nestjs/common';
import { JavaMiniServerService } from './services/JavaMiniServer.service';
import { JSMiniServerService } from './services/JSMiniServer.service';

@Module({
  exports: [JSMiniServerService, JavaMiniServerService],
  providers: [JSMiniServerService, JavaMiniServerService],
})
export class MiniServerModule {}
