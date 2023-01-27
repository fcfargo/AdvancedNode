const mongoose = require('mongoose');
const redis = require('redis');
const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);

// redis cache server 연결
client.on('error', (err) => console.log(err));
client.connect();

function overwriteExecFunc() {
  // mongoose 라이브러리 exec() 함수 참조 및 변수 할당
  // 함수 경로: node_modules/mongoose/lib/query.js
  const exec = mongoose.Query.prototype.exec;

  // 쿼리 객체 실행(exec()) 시
  // Redis Cache 읽기 및 쓰기 코드를 적용할 지 여부를 선택하는 메서드를 추가
  mongoose.Query.prototype.cache = function (options = {}) {
    this.useCache = true;
    this.hashKey = JSON.stringify(options.key || '');
    return this;
  };

  // 기존(original) exec() 함수 덮어쓰기(overwriting)
  // c.f) 프로토타입 메서드 정의할 경우 화살표 함수 대신 function 키워드 사용
  // apply(): exec() 함수 실행에 필요한 모든 인자를 전달해준다.
  // 함수 경로: node_modules/mongoose/lib/query.js
  mongoose.Query.prototype.exec = async function () {
    if (!this.useCache) {
      return exec.apply(this, arguments);
    }

    // Query.prototype.getFilter(): 쿼리문 조건을 반환
    // Query.mongooseCollection.name: 쿼리문 model 이름 반환
    // Object.assign(): 여러 개의 Object 객체를 하나의 Object 객체로 나타냄
    const key = JSON.stringify(Object.assign(this.getFilter(), { collection: this.mongooseCollection.name }));

    // See if we have a value for 'HashKey' in redis
    const cacheValue = await client.hGet(this.hashKey, key);

    // If we do, return that
    if (cacheValue) {
      const doc = JSON.parse(cacheValue);

      // Redis Cache data 형태를 mongoose model instance 형태로 반환해야한다.
      // 이를 위해 데이터를 new this.model(doc) 형태로 변환했다. 변환된 데이터는 아래 형태와 동일하다.
      // new Blog ({
      //  title: turkymp3,
      //  content: named player in JP ...,
      //  createdAt: 2023-01-18T12:28:18.702+00:00
      //  _user: 63c7e2bbc4a3d32ffb3bfff5,
      // })
      return Array.isArray(doc) ? doc.map((d) => new this.model(d)) : new this.model(doc);
    }

    // Otherwise, issue the query and store the result in redis
    const result = await exec.apply(this, arguments);

    // 데이터 return 처리 속도 향상 위해 비동기 함수로 사용
    client.hSet(this.hashKey, key, JSON.stringify(result));

    return result;
  };
}

function clearHash(hashKey) {
  client.del(JSON.stringify(hashKey));
}

module.exports = {
  overwriteExecFunc,
  clearHash,
};
