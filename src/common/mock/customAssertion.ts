import { HttpException } from '@nestjs/common'

export async function assertThrowError(
  produceExceptionFn: () => Promise<void>,
  exception: HttpException
) {
  let error: HttpException

  try {
    await produceExceptionFn()
  } catch (e) {
    error = e
  } finally {
    expect(error).toEqual(exception)
  }
}
