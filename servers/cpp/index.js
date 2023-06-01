const express = require('express');
const cors = require('cors');
const { v4 } = require('uuid');
const fs = require('fs');
const { spawnSync } = require('child_process');
const { runCode } = require('./runCode');
const app = express();

app.use(express.json());

app.use(cors());

app.get('/hello', (req, res) => {
  res.send("HELLO SERVER CPP v2")
});

app.post('/cpp/playground', (req, res) => {
  try {
    const { folder, fileName } = writeCodeToFile(req.body.code)
    const { stdout, stderr, executeTime } = runCode(folder, fileName)
    let result;
    stdout && (result = { status: "success", result: stdout, executeTime })
    stderr && (result = { status: "error", result: stderr, executeTime })

    res.json(result)
  }catch(err) {
    console.log(`Exception occurred!!!`, err);
  }
})

app.post('/cpp/test', (req, res) => {
  try {
    const { code, command } = req.body;
    const { folder, fileName } = writeCodeToFile(`${code}\n${command}`)
    const { stdout, stderr, executeTime } = runCode(folder, fileName)
    let result;
    stdout && (result = { status: "success", result: stdout, executeTime })
    stderr && (result = { status: "error", result: stderr, executeTime })
  
    res.json(result)
  }catch(err) {
    console.log(`Exception occurred!!!`, err);
  }

})


function writeCodeToFile (code) {
  const folder = `${__dirname}/cppFiles/temp_${Date.now()}`;
  const fileName = v4();
  const path = `${folder}/${fileName}.cpp`

  if(!fs.existsSync(folder)) {
    fs.mkdirSync(folder)
  }

  fs.writeFileSync(path, code);

  return {folder, fileName}
}

app.listen(6004, () => {
  console.log('CPP mini server listen from 6004');
});