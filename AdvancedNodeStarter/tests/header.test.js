const puppeteer = require('puppeteer');

// test() = it()
test('We can launch a browser', async () => {
  // Uses non-headless mode
  const browser = await puppeteer.launch({ headless: false });

  // Represents Individual Chrominum Browser Tab
  const page = await browser.newPage();

  // Navigae to app
  // 'http://' 생략 시 Error: net::err_aborted
  await page.goto('http://localhost:3000');

  // page.$eval(): run 'document.querySelector'
  const text = await page.$eval('a.brand-logo', (el) => el.textContent);
  expect(text).toEqual('Blogster');

  await browser.close();
});
