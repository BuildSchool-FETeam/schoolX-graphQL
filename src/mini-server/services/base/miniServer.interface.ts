export interface TestResponse {
  executeTime: number;
  status: string;
  result: string[];
}

export interface ITestCaseConfig {
  runningTestScript: string;
}

export interface MiniServerDTO {
  executeTime: number;
  status: string;
  result: string[];
}

export interface IMiniServerService {
  runCode(code: string): Promise<TestResponse>;
  runCodeWithTestCase(
    code: string,
    testCase: ITestCaseConfig,
  ): Promise<TestResponse>;
}
