import { Module } from '@nestjs/common'
import { PythonMiniServerService } from './services/PythonMiniServer.service'
import { JavaMiniServerService } from './services/JavaMiniServer.service'
import { JSMiniServerService } from './services/JSMiniServer.service'

@Module({
  exports: [
    JSMiniServerService,
    JavaMiniServerService,
    PythonMiniServerService,
  ],
  providers: [
    JSMiniServerService,
    JavaMiniServerService,
    PythonMiniServerService,
  ],
})
export class MiniServerModule {}
