//  libuv가 생성할 thread_pool의 thread 개수 설정 변수
// process.env.UV_THREADPOOL_SIZE = 8;

const crypto = require("crypto");

const time = Date.now();

crypto.pbkdf2("1234", "b", 100000, 512, "sha512", () => {
  console.log("1:", Date.now() - time);
});

crypto.pbkdf2("1234", "b", 100000, 512, "sha512", () => {
  console.log("2:", Date.now() - time);
});

crypto.pbkdf2("1234", "b", 100000, 512, "sha512", () => {
  console.log("3:", Date.now() - time);
});

crypto.pbkdf2("1234", "b", 100000, 512, "sha512", () => {
  console.log("4:", Date.now() - time);
});

crypto.pbkdf2("1234", "b", 100000, 512, "sha512", () => {
  console.log("5:", Date.now() - time);
});

crypto.pbkdf2("1234", "b", 100000, 512, "sha512", () => {
  console.log("6:", Date.now() - time);
});

crypto.pbkdf2("1234", "b", 100000, 512, "sha512", () => {
  console.log("7:", Date.now() - time);
});

crypto.pbkdf2("1234", "b", 100000, 512, "sha512", () => {
  console.log("8:", Date.now() - time);
});

crypto.pbkdf2("1234", "b", 100000, 512, "sha512", () => {
  console.log("9:", Date.now() - time);
});
