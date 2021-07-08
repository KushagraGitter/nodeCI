const puppeteer = require("puppeteer");
const sessionFactory = require("./factories/sessionFactory");
const userFactory = require("./factories/userFactory");

let browser, page;

beforeEach(async () => {
  browser = await puppeteer.launch({
    headless: false,
  });
  page = await browser.newPage();
  await page.goto("http://localhost:3000");
});

afterEach(async () => {
  await browser.close();
});

test("we can launch a browser", async () => {
  const text = await page.$eval("a.brand-logo", (el) => el.innerHTML);
  expect(text).toEqual("Blogster");
});

// test('simulate login with cookie key', async () => {
//     //const id = '60d03e9f839d4b5b0815c570';
//     const user = await userFactory();

//     const {sesson, sig} = sessionFactory(user);

//     await page.setCookie({ name:'session' , value: session });
//     await page.setCookie({ name: 'session.sig', value: sig });

//     await page.goto('http://localhost:3000');

//     await page.waitForTimeout(1000);

//     const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);

//     expect(text).toEqual('Logout');

// })
