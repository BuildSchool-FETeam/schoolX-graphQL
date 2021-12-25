import { EnvVariable } from 'src/common/interfaces/EnvVariable.interface'
import { ConfigService } from '@nestjs/config'
import { Injectable } from '@nestjs/common'
import {
  IMiniServerService,
  ITestCaseConfig,
  TestResponse,
  MiniServerDTO,
} from './base/miniServer.interface'
import { MiniServerBaseService } from './base/MiniServer.base.service'

@Injectable()
export class PythonMiniServerService
  extends MiniServerBaseService
  implements IMiniServerService
{
  constructor(private configService: ConfigService<EnvVariable>) {
    super(configService, 'PYTHON_MINI_SERVER')
  }

  async runCode(code: string): Promise<TestResponse> {
    const result = await this.axiosInstance.post<MiniServerDTO>(
      '/python/playground',
      { code }
    )

    return { ...result.data }
  }

  async runCodeWithTestCase(
    code: string,
    testCase: ITestCaseConfig
  ): Promise<TestResponse> {
    const result = await this.axiosInstance.post<MiniServerDTO>(
      '/python/test',
      { code, command: testCase.runningTestScript }
    )

    return { ...result.data }
  }
}
