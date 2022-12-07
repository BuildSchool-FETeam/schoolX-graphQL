/* eslint-disable @typescript-eslint/no-explicit-any */
export function systemLogs(...optionsParams: any[]) {
  console.info('[SYSTEM LOGS]: ' + optionsParams)
}

export function errorLogs(...optionsParams: any[]) {
  console.error('[ERROR LOGS]: ' + optionsParams)
}
