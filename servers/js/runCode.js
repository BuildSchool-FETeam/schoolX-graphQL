const {spawnSync} = require('child_process')

exports.runCode = (fileName) => {
  const start = Date.now();

  const jsProcess = spawnSync("node", [fileName])
  const stdout = jsProcess.stdout.toString().trim().split('\n');
  const stderr = jsProcess.stderr.toString().trim();

  const finish = Date.now()
  return {
    stderr,
    stdout,
    executeTime: finish - start
  }
}