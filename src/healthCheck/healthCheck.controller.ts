import { Controller, Get, HttpCode } from '@nestjs/common'

@Controller('/health')
export class HealthCheckController {
  @Get()
  @HttpCode(200)
  index(): string {
    return 'Everything is ok'
  }
}
