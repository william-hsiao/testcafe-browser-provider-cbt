const request = require('request');

const url = 'http://crossbrowsertesting.com/api/v3/selenium/browsers';

async function getBrowserList() {
  const browserList = [];
  request(url, (err, res, body) => {
    if (err) {
      console.error(err);
      return;
    }

    const data = JSON.parse(body);
    data.forEach(item => {
      item.browsers.forEach(browser => {
        if (item.device === 'mobile') {
          browserList.push(`Mobile ${browser.caps.browserName}@${item.caps.platformVersion}:${item.caps.deviceName}`);
        } else {
          browserList.push(`${browser.caps.browserName}@${browser.caps.version}:${item.caps.platform}`);
        }
      })
    })

    // return browserList;
    console.log(browserList);
  })
}

getBrowserList();