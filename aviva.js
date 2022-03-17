/**
 * `AVIVA_USER=myuser AVIVA_PWD=mypassword node aviva.js`
 *
 */
const puppeteer = require('puppeteer-extra');

const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

puppeteer.launch({ headless: false }).then(async browser => {
	
  const page = await browser.newPage();
  const session = await page.target().createCDPSession();
  const {windowId} = await session.send('Browser.getWindowForTarget');
  //await session.send('Browser.setWindowBounds', {windowId, bounds: {windowState: 'minimized'}});

  await page.setViewport({ width: 1280, height: 1280 });
  await page.setCookie({ 'name': 'OptanonAlertBoxClosed', 'value': '2021-04-19T11:35:35.166Z', 'domain': '.aviva.co.uk' });
  await page.goto('https://www.direct.aviva.co.uk/MyAccount/login');
  await page.waitForSelector('#username');
  await page.type('#username', process.env.AVIVA_USER);
  await page.type('#password', process.env.AVIVA_PWD);
  //await page.screenshot({ path: 'one.png' });
  await page.click('#loginButton');
  await page.waitForSelector("html");
  //console.log( "two" );
  //await page.screenshot({ path: 'two.png' });
  // FIX THIS - should work out the URL below
  const firstResponse = await page.waitForResponse('https://www.direct.aviva.co.uk/MyPortfolio/Product/ProductDetailsWithVariant?productType=Pension&productCode=50010');
  //console.log( "three" );

  var response = await firstResponse.text();
  var matched = response.match(new RegExp("Total plan value.*?pound;([0-9,.]*)[^0-9,.]", "m"));
  var balance = matched[1].replace(",","");	

  console.log( balance );

  await browser.close();
})
