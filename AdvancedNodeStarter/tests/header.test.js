const puppeteer = require('puppeteer');
const sessionFactory = require('./factories/sessionFactory');
const userFactory = require('./factories/userFactory');

let browser, page;
beforeEach(async () => {
  // Uses non-headless mode
  browser = await puppeteer.launch({ headless: false });

  // Represents Individual Chrominum Browser Tab
  page = await browser.newPage();

  // Navigae to app
  // 'http://' 생략 시 Error: net::err_aborted
  await page.goto('http://localhost:3000');
});

afterEach(async () => {
  await browser.close();
});

test('브라우저 헤더 텍스트가 일치할 경우 브라우저 실행은 성공한다.', async () => {
  // page.$eval(): run 'document.querySelector'
  const text = await page.$eval('a.brand-logo', (el) => el.textContent);
  expect(text).toEqual('Blogster');
});

test('브라우저 Login 버튼 클릭에 성공할 경우 google account 페이지로 이동한다.', async () => {
  await page.click('.right a');

  const url = await page.url();
  expect(url).toMatch(new RegExp('accounts.google.com'));
});

test.only('클라이언트 세션 쿠키 데이터 설정하여 요청할 경우 브라우저 헤더에 Logout 텍스트가 나타난다.', async () => {
  // create tetsUser
  const testUser = await userFactory();

  // get session cookie && encrypted session cookie
  const { sessionString, sessionSignature } = await sessionFactory(testUser._id.toString());

  // set Cookie
  await page.setCookie({ name: 'session', value: sessionString }, { name: 'session.sig', value: sessionSignature });

  // refresh page
  await page.goto('http://localhost:3000');

  // sleep
  await page.waitForSelector('a[href="/auth/logout"]');

  // select element
  const text = await page.$eval('a[href="/auth/logout"]', (el) => el.textContent);
  expect(text).toEqual('Logout');
});
