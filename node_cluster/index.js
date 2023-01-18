// 정확한 성능 측정을 위해 사용할 thread-pool 개수를 한 개로 설정
process.env.UV_THREADPOOL_SIZE = 1;
const cluster = require('cluster');
const crypto = require('crypto');
const express = require('express');
const app = express();

app.get('/', function (req, res) {
  crypto.pbkdf2('1234', 'b', 100000, 512, 'sha512', () => {
    res.send('Hi there');
  });
});

app.get('/fast', function (req, res) {
  res.send('This was fast!');
});

app.listen(8005);
