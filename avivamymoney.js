/**
 * `AVIVA_USER=myuser AVIVA_PWD=mypassword node aviva.js`
 *
 */
const puppeteer = require('puppeteer-extra');

const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

puppeteer.launch({ headless: false }).then(async browser => {
	
  const page = await browser.newPage();

  try {
    const session = await page.target().createCDPSession();
    const { windowId } = await session.send('Browser.getWindowForTarget');
    //await session.send('Browser.setWindowBounds', {windowId, bounds: {windowState: 'minimized'}});

    await page.setViewport({ width: 768, height: 768 })

    await page.goto('https://www.avivamymoney.co.uk/Login');
    await page.waitForSelector('#onetrust-accept-btn-handler');
    await page.click('#onetrust-accept-btn-handler');

    await page.waitForSelector('a.btn-primary:nth-child(1)');
    await page.type('#Username', process.env.AVIVAMYMONEY_USER, {delay: 10});
    await page.type('#Password', process.env.AVIVAMYMONEY_PWD, {delay: 10});

    await page.waitForTimeout(1000);
    await page.click('a.btn-primary:nth-child(1)');

    await page.waitForSelector("html");

    await page.waitForSelector("#FirstLetter");

    await page.select("#FirstLetter", process.env.AVIVAMYMONEY_WORD.charAt(await page.evaluate('document.querySelector("#FirstElement_Index").getAttribute("value")') - 1));
    await page.select("#SecondLetter", process.env.AVIVAMYMONEY_WORD.charAt(await page.evaluate('document.querySelector("#SecondElement_Index").getAttribute("value")') - 1));
    await page.select("#ThirdLetter", process.env.AVIVAMYMONEY_WORD.charAt(await page.evaluate('document.querySelector("#ThirdElement_Index").getAttribute("value")') - 1));

    await page.click('[name=Next]');
    const element = await page.waitForSelector(".vspace-reset.text-size-42");

    const balance = await element.evaluate(el => el.textContent);
    console.log(balance.replace("£", "").replace(",", ""));

  } catch (error) {
    console.error(error);
    await page.screenshot({ path: 'debug-avivamymoney-' + process.env.AVIVAMYMONEY_USER + '.png' });
  }

  await browser.close();
})
