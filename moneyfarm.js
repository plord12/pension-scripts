/**
 * `MONEYFARM_USER=myuser MONEYFARM_PWD=mypassword MONEYFARM_TYPE=isa node moneyfarm.js`
 *
 */
const puppeteer = require('puppeteer');

puppeteer.launch({ headless: true }).then(async browser => {
	
  const page = await browser.newPage();
  //const session = await page.target().createCDPSession();
  //const {windowId} = await session.send('Browser.getWindowForTarget');
  //await session.send('Browser.setWindowBounds', {windowId, bounds: {windowState: 'minimized'}});
  await page.setViewport({ width: 1280, height: 1280 });
  await page.goto('https://app.moneyfarm.com/gb/sign-in');
  await page.waitForSelector('#root > div > div > div > div > div > div.sc-jgHCSr.grdnS > button');
  await page.click('#root > div > div > div > div > div > div.sc-jgHCSr.grdnS > button');
  await page.waitForSelector('#email');
  await page.type('#email', process.env.MONEYFARM_USER);
  await page.type('#password', process.env.MONEYFARM_PWD);
  await page.click('[type=submit]');
  await page.waitForSelector("html");
  const firstResponse = await page.waitForResponse(response => response.url() === 'https://api.moneyfarm.com/api/client/me/me-webapp' && response.status() === 200);
  var response = await firstResponse.text();
  // console.log( response );

  var balance;

  if (process.env.MONEYFARM_TYPE == "isa" ) {
    balance = JSON.parse(response).portfoliosByProduct.isa[0].currentMarketValue;
  } else {
    balance = JSON.parse(response).portfoliosByProduct.sipp[0].currentMarketValue;
  }

  console.log( balance );

  await browser.close();
})
