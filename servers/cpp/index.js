const express = require('express');
const cors = require('cors');
const { v4 } = require('uuid');
const fs = require('fs');
const { spawnSync } = require('child_process');
const app = express();

app.use(express.json());

app.use(cors());

app.get('/hello', (req, res) => {
  res.send("HELLO SERVER CPP")
});

app.post('/cpp/playground', (req, res) => {
  
})

app.listen(6004, () => {
  console.log('CPP mini server listen from 6004');
});
