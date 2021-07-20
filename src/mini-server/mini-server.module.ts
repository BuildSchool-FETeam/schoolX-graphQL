import { PythonMiniServerService } from './services/PythonMiniServer.service';
import { Module } from '@nestjs/common';
import { JavaMiniServerService } from './services/JavaMiniServer.service';
import { JSMiniServerService } from './services/JSMiniServer.service';

@Module({
  exports: [JSMiniServerService, JavaMiniServerService, PythonMiniServerService],
  providers: [JSMiniServerService, JavaMiniServerService, PythonMiniServerService],
})
export class MiniServerModule {}
