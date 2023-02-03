const puppeteer = require('puppeteer');

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

afterAll(async () => {
  await browser.close();
});

// test() = it()
test('We can launch a browser', async () => {
  // page.$eval(): run 'document.querySelector'
  const text = await page.$eval('a.brand-logo', (el) => el.textContent);
  expect(text).toEqual('Blogster');
});
