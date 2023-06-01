const express = require('express');
const cors = require('cors');
const { v4 } = require('uuid');
const fs = require('fs');
const { runCode } = require('./runCode');

const app = express();

app.use(express.json());

app.use(cors());

app.get('/hello', (req, res) => {
  res.send('HELLO FROM JAVA v2');
});

function writeCodeToFile(code, specificDirname) {
  const dirName = specificDirname || '/home/app/javaFiles/temp_' + Date.now();
  const className = /public class (\w+) ?{/.exec(code)?.[1] || 'Main';
  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName);
  }
  const path = `${dirName}/${className}.java`;
  fs.writeFileSync(path, code);
  return { dirName, className };
}

app.post('/java/playground', (req, res) => {
  const { code } = req.body;
  let result;

  const { dirName, className } = writeCodeToFile(code);

  try {
    const { stderr, stdout, executeTime } = runCode(dirName, className);
    stdout && (result = { status: 'success', result: stdout, executeTime });
    stderr && (result = { status: 'error', result: stderr, executeTime });

    res.json(result);
  } catch (err) {
    console.log(`Exception occurred!!!`, err);
  }
});

app.post('/java/test', (req, res) => {
  const { code, command } = req.body;

  const { dirName: dirNameCode } = writeCodeToFile(code);
  const { dirName: dirNameTestCommand, className: classNameOfTestCommand } = writeCodeToFile(command, dirNameCode);

  let result;
  try {
    const { stderr, stdout, executeTime } = runCode(dirNameTestCommand, classNameOfTestCommand);

    stdout && (result = { status: 'success', result: stdout, executeTime });
    stderr && (result = { status: 'error', result: stderr, executeTime });

    res.json(result);
  } catch (err) {
    console.log(`Exception occurred!!!`, err);
  }
});

app.listen(6002, () => {
  console.log('Java mini server listen from 6002');
});
