jest.mock('jimp', () => {
  return {
    read(b: Buffer) {
      return {
        resize: jest.fn(),
      }
    },
  }
})
