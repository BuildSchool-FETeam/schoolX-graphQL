const express = require('express');
const cors = require('cors');
const { v4 } = require('uuid');
const fs = require('fs');
const { runCode } = require('./runCode');

const app = express();

app.use(express.json());

app.use(cors());

app.get('/hello', (req, res) => {
  res.send('HELLO FROM PYTHON');
});

app.post('/python/playground', (req, res) => {
  const { code } = req.body;
  const name = `${v4()}.py`;
  fs.writeFileSync(name, code);

  let result;

  try {
    const { stderr, stdout, executeTime } = runCode(name);
    stdout && (result = { status: 'success', result: stdout, executeTime });
    stderr && (result = { status: 'error', result: stderr, executeTime });

    res.json(result);
    fs.unlinkSync(name);
  } catch (err) {
    fs.unlinkSync(name);
    console.log(`Exception occurred!!!`, err);
  }
});

app.post('/python/test', (req, res) => {
  const { code, command } = req.body;
  const name = `${v4()}.py`;
  fs.writeFileSync(name, code);
  fs.appendFileSync(name, `\n${command}`);

  let result;
  try {
    const { stderr, stdout, executeTime } = runCode(name);
    stdout && (result = { status: 'success', result: stdout, executeTime });
    stderr && (result = { status: 'error', result: stderr, executeTime });

    res.json(result);
    fs.unlinkSync(name);
  } catch (err) {
    fs.unlinkSync(name);
    console.log(`Exception occurred!!!`, err);
  }
});

app.listen(6003, () => {
  console.log('JS mini server listen from 6003');
});
