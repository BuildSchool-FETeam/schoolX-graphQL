jest.mock('jimp', () => {
  return {
    read() {
      return {
        resize: jest.fn(),
      }
    },
  }
})
