jest.mock('bcrypt', () => ({
  hashSync(str: string, salt: number) {
    return str + '_' + salt
  },

  compareSync(str1: string, str2: string) {
    return str1 === str2
  },
}))
