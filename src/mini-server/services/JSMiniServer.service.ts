import { ConfigService } from '@nestjs/config';
import { EnvVariable } from 'src/common/interfaces/EnvVariable.interface';
import {
  ITestCaseConfig,
  MiniServerDTO,
  MiniServerService,
} from './miniServer.interface';
import * as axios from 'axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JSMiniServerService implements MiniServerService {
  axiosInstance: axios.AxiosInstance;
  host: string;

  constructor(private configService: ConfigService<EnvVariable>) {
    this.host = this.configService.get<string>('JS_MINI_SERVER');
    this.axiosInstance = axios.default.create({
      baseURL: this.host,
      timeout: 10000,
    });
  }

  async runCode(code: string) {
    const response = await this.axiosInstance.post<MiniServerDTO>(
      '/js/playground',
      {
        code,
      },
    );

    return response.data;
  }

  async runCodeWithTestCase(code: string, testCase: ITestCaseConfig) {
    const response = await this.axiosInstance.post<MiniServerDTO>('/js/test', {
      code,
      command: testCase.runningTestScript,
    });

    return response.data;
  }
}
