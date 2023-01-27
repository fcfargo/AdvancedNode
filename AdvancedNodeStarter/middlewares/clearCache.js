const { clearHash } = require('../services/cache');

module.exports = async (req, res, next) => {
  // 다음 순서 미들웨어 함수를 실행
  await next();

  // 다음 순서 미들웨어 함수 실행 완료 후 실행할 코드
  clearHash(req.user.id);
};
