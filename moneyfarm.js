/**
 * `MONEYFARM_USER=myuser MONEYFARM_PWD=mypassword MONEYFARM_TYPE=isa node moneyfarm.js`
 *
 */
const puppeteer = require('puppeteer');

puppeteer.launch({ headless: false }).then(async browser => {
	
  const page = await browser.newPage();

  try {

    //const session = await page.target().createCDPSession();
    //const {windowId} = await session.send('Browser.getWindowForTarget');
    //await session.send('Browser.setWindowBounds', {windowId, bounds: {windowState: 'minimized'}});
    await page.setViewport({ width: 1024, height: 800 });
    await page.goto('https://app.moneyfarm.com/gb/sign-in');
    await page.waitForTimeout(4000);
    const [button] = await page.$x("//button[contains(., 'OK, I agree')]");
    if (button) {
      await button.click();
    }

    //await page.waitForSelector('[data-role=primary]');
    //await page.click('[data-role=primary]');
    await page.waitForSelector('[type=submit]');
    await page.type('#email', process.env.MONEYFARM_USER);
    await page.type('#password', process.env.MONEYFARM_PWD);
    await page.click('[type=submit]');
    await page.waitForSelector("html");

    // read OTP
    //
    var otp = "";
    const page2 = await browser.newPage();
    for (let attempt = 0; attempt < 100; attempt++) {
      try {
        const optfile = await page2.goto('file:///home/plord/src/pension-scripts/otp/moneyfarm');
        const innerText = await page2.evaluate(() => {
          return JSON.parse(document.querySelector("body").innerText);
        });
        otp = innerText.message.split('\n')[1].split(' ')[0];
	await page2.close();
        break;
      } catch (error) {
        await page2.waitForTimeout(1000);
      }
    }

    //console.log(otp);

    // submit
    //
    await page.waitForSelector('#code');
    await page.type('#code', otp);
    await page.click('[type=submit]');

    var element = await page.waitForSelector('h3.sc-bdfBQB > span:nth-child(1)');
    var balance = await element.evaluate(el => el.textContent);
    balance = balance.replace("£", "").replace(",", "")
    console.log(balance);

  } catch (error) {
    console.error(error);
    await page.screenshot({ path: 'debug-moneyfarm-' + process.env.MONEYFARM_USER + '.png' });
  }

  await browser.close();
})
