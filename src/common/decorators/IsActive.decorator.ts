import { SetMetadata } from '@nestjs/common'

export const IS_ACTIVE_KEY = 'accountIsActive'
export const IsActive = (isActive = true) =>
  SetMetadata(IS_ACTIVE_KEY, isActive)
