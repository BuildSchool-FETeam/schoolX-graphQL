function printRec() {
  const WIDTH = 17
  const HEIGHT = 18

  for (let i = 1; i <= HEIGHT; i++) {
    let row = ''

    for (let j = 1; j <= WIDTH; j++) {
      if (i === 1 || i === HEIGHT) {
        row += '*'
      } else {
        if (i % 2 === 0) {
          if (j % 2 === 0) {
            row += '*'
          } else {
            row += ' '
          }
        } else {
          if (j % 2 !== 0) {
            row += '*'
          } else {
            row += ' '
          }
        }
      }
    }

    console.log(row)
  }
}

printRec()
