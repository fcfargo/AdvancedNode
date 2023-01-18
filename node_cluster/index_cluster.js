// 정확한 성능 측정을 위해 사용할 thread-pool 개수를 한 개로 설정
process.env.UV_THREADPOOL_SIZE = 1;
const cluster = require('cluster');
const crypto = require('crypto');
const express = require('express');
const app = express();

const numCPUs = require('os').cpus().length;

// Cluster Manager 실행 여부 판단
if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    // 현재 실행 중인 스크립트 파일을 child mode로 재실행(child process 실행)
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  app.get('/', function (req, res) {
    crypto.pbkdf2('1234', 'b', 100000, 512, 'sha512', () => {
      res.send('Hi there');
    });
  });

  app.get('/fast', function (req, res) {
    res.send('This was fast!');
  });

  app.listen(8005);

  console.log(`Worker ${process.pid} started`);
}
