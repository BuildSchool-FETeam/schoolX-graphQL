const { spawnSync } = require('child_process')

exports.runCode = (folder, fileName) => {
  try {
    const start = Date.now()
    const cppProcess = spawnSync('./runCppCode.sh', [folder, fileName])
    const stdout = cppProcess.stdout.toString().trim().split('\n')
    const stderr = cppProcess.stderr.toString().trim()

    const finish = Date.now()

    return {
      stdout,
      stderr: stderr ? stderr.split('\n') : null,
      executeTime: finish - start,
    }
  } catch (err) {
    throw new Error('Error occur', err)
  }
}
