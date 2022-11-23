import { Module } from '@nestjs/common'
import { PythonMiniServerService } from './services/PythonMiniServer.service'
import { JavaMiniServerService } from './services/JavaMiniServer.service'
import { JSMiniServerService } from './services/JSMiniServer.service'
import { CppMiniServerService } from './services/CppMiniserver.service'

@Module({
  exports: [
    JSMiniServerService,
    JavaMiniServerService,
    PythonMiniServerService,
    CppMiniServerService,
  ],
  providers: [
    JSMiniServerService,
    JavaMiniServerService,
    PythonMiniServerService,
    CppMiniServerService,
  ],
})
export class MiniServerModule {}
