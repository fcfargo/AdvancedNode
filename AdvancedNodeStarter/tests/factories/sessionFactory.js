const Buffer = require('buffer/').Buffer;
const Keygrip = require('keygrip');
const { cookieKey } = require('../../config/dev');

// cookieKey 활용하여 Keygrip 객체 생성
const keygrip = new Keygrip([cookieKey]);

module.exports = (uid) => {
  // create Session Object
  const sessionObject = {
    passport: {
      user: uid,
    },
  };

  // create Session String
  const sessionString = Buffer.from(JSON.stringify(sessionObject), 'utf-8').toString('base64');

  // create Session Signature(sessionString 쿠키 데이터 서명)
  const sessionSignature = keygrip.sign('session=' + sessionString);

  return { sessionString, sessionSignature };
};
