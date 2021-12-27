import { ConfigService } from '@nestjs/config'
import { EnvVariable } from 'src/common/interfaces/EnvVariable.interface'
import { Injectable } from '@nestjs/common'
import { MiniServerBaseService } from './base/MiniServer.base.service'
import {
  IMiniServerService,
  MiniServerDTO,
  ITestCaseConfig,
} from './base/miniServer.interface'

@Injectable()
export class JSMiniServerService
  extends MiniServerBaseService
  implements IMiniServerService
{
  constructor(private configService: ConfigService<EnvVariable>) {
    super(configService, 'JS_MINI_SERVER')
  }

  async runCode(code: string) {
    const response = await this.axiosInstance.post<MiniServerDTO>(
      '/js/playground',
      {
        code,
      }
    )

    return response.data
  }

  async runCodeWithTestCase(code: string, testCase: ITestCaseConfig) {
    const response = await this.axiosInstance.post<MiniServerDTO>('/js/test', {
      code,
      command: testCase.runningTestScript,
    })

    return response.data
  }
}
