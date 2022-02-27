export class StreamMock {
  public methodCalled: string[] = []

  pipe() {
    this.methodCalled.push('pipe')

    return this
  }

  on(methodKey: string, cb: () => void) {
    this.methodCalled.push('on-' + methodKey)

    if (methodKey !== 'error') {
      cb()
    }

    return this
  }
}
