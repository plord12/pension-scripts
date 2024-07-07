/**
 * `NUTMEG_USER=myuser NUTMEG_PWD=mypassword NUTMEG_NAME="My pension" node nutmeg.js`
 *
 */
const puppeteer = require('puppeteer');

puppeteer.launch({ headless: true }).then(async browser => {
	
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1280 });

  try {
    await page.goto('https://authentication.nutmeg.com/login');
    await page.waitForSelector('#onetrust-accept-btn-handler');
    await page.click('#onetrust-accept-btn-handler');

    await page.waitForSelector('#username');
    await page.type('#username', process.env.NUTMEG_USER);
    await page.type('#password', process.env.NUTMEG_PWD);

    await page.keyboard.press('Enter');

    //const [button] = await page.$x("//button[contains(., 'Sign in')]");
    //console.log(button);
    //if (button) {
    //  await button.click();
    //}
    //await page.click('button.cb8dcbc41:nth-child(1)');

    try {
      var element = await page.waitForSelector("section._nk-section--stack-spacing-lg_txy8p_16:nth-child(2) > section:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2)");
      var balance = await element.evaluate(el => el.textContent);
      balance = balance.replace("£", "").replace(",", "")
      console.log(balance);
    } catch (error) {
      var element = await page.waitForSelector("section._nk-section--stack-spacing-lg_txy8p_16:nth-child(1) > section:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2)");
      var balance = await element.evaluate(el => el.textContent);
      balance = balance.replace("£", "").replace(",", "")
      console.log(balance);
    }

  } catch (error) {
    console.error(error);
    await page.screenshot({ path: 'debug-nutmeg-' + process.env.NUTMEG_USER + '.png' });
  }

  await browser.close();
})
