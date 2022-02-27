class SharpMock {
  public methodCalled = []

  resize() {
    this.methodCalled.push('resize')

    return this
  }

  toFormat() {
    this.methodCalled.push('toFormat')

    return this
  }

  rotate() {
    this.methodCalled.push('rotate')

    return this
  }

  sharpen() {
    this.methodCalled.push('sharpen')

    return this
  }
}

jest.mock('sharp', () => {
  return function () {
    return new SharpMock()
  }
})
