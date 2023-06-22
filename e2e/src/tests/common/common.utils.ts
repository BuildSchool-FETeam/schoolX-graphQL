/* eslint-disable @typescript-eslint/no-explicit-any */
export function getErrMessage(err: any) {
  return err.response.errors[0].message
}
