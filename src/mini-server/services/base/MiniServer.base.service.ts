import { ConfigService } from '@nestjs/config'
import axios, { AxiosInstance } from 'axios'
import { EnvVariable } from 'src/common/interfaces/EnvVariable.interface'

export abstract class MiniServerBaseService {
  axiosInstance: AxiosInstance

  host: string

  constructor(configService: ConfigService, envName: keyof EnvVariable) {
    this.host = configService.get(envName)
    this.axiosInstance = axios.create({
      baseURL: this.host,
      timeout: 10000,
    })
  }
}
