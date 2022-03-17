/**
 * `FUND=0P0001JLD9 node fund.js`
 *
 */
const puppeteer = require('puppeteer');

puppeteer.launch({ headless: true }).then(async browser => {
	
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1280 });
  const firstResponse = await page.goto('https://markets.ft.com/data/funds/tearsheet/summary?s='+process.env.FUND);
  var response = await firstResponse.text();

  var matched = response.match(new RegExp("<span class=\"mod-ui-data-list__value\">([0-9.]*)</span>", "s"));
  var balance = matched[1];

  console.log( balance );

  await browser.close();
})
