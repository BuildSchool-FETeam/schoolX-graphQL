const { spawnSync } = require('child_process');

exports.runCode = (fileName) => {
  const start = Date.now();
  try {
    const jsProcess = spawnSync('node', [fileName]);
    const stdout = jsProcess.stdout.toString().trim().split('\n');
    const stderr = jsProcess.stderr.toString().trim();

    const finish = Date.now();
    return {
      stderr: stderr ? [stderr] : null,
      stdout,
      executeTime: finish - start,
    };
  } catch (err) {
    throw new Error('Error Occur', err);
  }
};
