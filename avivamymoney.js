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

  await page.setViewport({width: 1280, height: 1280})
  
  await page.goto('https://www.avivamymoney.co.uk/Login');
  await page.waitForSelector('.btn-primary.full-width');
  await page.type('#Username', process.env.AVIVAMYMONEY_USER);
  await page.type('#Password', process.env.AVIVAMYMONEY_PWD);

  await page.click('.btn-primary.full-width');

  await page.waitForSelector("html");

  await page.waitForSelector("#FirstLetter");

  await page.select("#FirstLetter", process.env.AVIVAMYMONEY_WORD.charAt(await page.evaluate('document.querySelector("#FirstElement_Index").getAttribute("value")')-1));
  await page.select("#SecondLetter", process.env.AVIVAMYMONEY_WORD.charAt(await page.evaluate('document.querySelector("#SecondElement_Index").getAttribute("value")')-1));
  await page.select("#ThirdLetter", process.env.AVIVAMYMONEY_WORD.charAt(await page.evaluate('document.querySelector("#ThirdElement_Index").getAttribute("value")')-1));

  await page.click('.btn-primary.full-width');
  const element = await page.waitForSelector(".vspace-reset.text-size-42");

  const balance = await element.evaluate(el => el.textContent);
  console.log( balance.replace("£","").replace(",","") );

  await browser.close();
})
