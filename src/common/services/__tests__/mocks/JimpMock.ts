export class JimpMock {
  public methodCalled = []
  buffer: Buffer | string
  constructor(buffer: Buffer | string) {
    this.buffer = buffer
  }

  resize() {
    this.methodCalled.push('resize')

    return this
  }

  cover() {
    this.methodCalled.push('cover')

    return this
  }

  rotate() {
    this.methodCalled.push('rotate')

    return this
  }

  opacity() {
    this.methodCalled.push('opacity')

    return this
  }

  blur() {
    this.methodCalled.push('blur')

    return this
  }

  getMIME() {
    this.methodCalled.push('getMime')

    return this
  }

  getBuffer(_, cb) {
    cb(null, this.methodCalled)
  }
}

jest.mock('jimp', () => {
  return {
    read(b: Buffer) {
      return new JimpMock(b)
    },
  }
})
