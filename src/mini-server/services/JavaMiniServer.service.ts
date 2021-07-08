import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MiniServerBaseService } from './base/MiniServer.base.service';
import {
  IMiniServerService,
  ITestCaseConfig,
  MiniServerDTO,
  TestResponse,
} from './base/miniServer.interface';

@Injectable()
export class JavaMiniServerService
  extends MiniServerBaseService
  implements IMiniServerService {
  constructor(private configService: ConfigService) {
    super(configService, 'JAVA_MINI_SERVER');
  }

  async runCode(code: string): Promise<TestResponse> {
    const response = await this.axiosInstance.post<MiniServerDTO>(
      '/java/playground',
      {
        code,
      },
    );

    return response.data;
  }

  async runCodeWithTestCase(
    code: string,
    testCase: ITestCaseConfig,
  ): Promise<TestResponse> {
    const response = await this.axiosInstance.post<MiniServerDTO>(
      '/java/test',
      {
        code,
        command: testCase.runningTestScript,
      },
    );

    return response.data;
  }
}
