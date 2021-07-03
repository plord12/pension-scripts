/**
 * `NUTMEG_USER=myuser NUTMEG_PWD=mypassword NUTMEG_NAME="My pension" node nutmeg.js`
 *
 */
const puppeteer = require('puppeteer');

puppeteer.launch({ headless: true }).then(async browser => {
	
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1280 });
  await page.goto('https://login.nutmeg.com/');
  await page.waitForSelector('#email');
  await page.type('#email', process.env.NUTMEG_USER);
  await page.type('#password', process.env.NUTMEG_PWD);
  await page.click('[type=submit]');
  await page.waitForSelector("html");
  const firstResponse = await page.waitForResponse(response => response.url() === 'https://app.nutmeg.com/client/portfolio' && response.status() === 200);
  var response = await firstResponse.text();
  //console.log( response );

  /*
                  <!-- fund name -->
                  <h4 class="fund-name" style="margin-top: 7px;" rel="tooltip" title="">
                    My Nutmeg pension
                  </h4>
                </div>

                <div class="col-xs-2 fund-pending-transfers" style="margin-top: 2px;" id="pending_values_ae3fdad3-fe3f-4378-b5d2-bce0cdc69f17">
                  <h2 class="amount text-right pull-right" style="margin-right: 20px;">

                    &pound;464,255
  */


  var matched = response.match(new RegExp("h4 class=\"fund-name\"[^>]*>[^>]*"+process.env.NUTMEG_NAME+".*?&pound;([0-9,]*)", "s"));
  var balance = matched[1].replace(",","");

  console.log( balance );

  await browser.close();
})
