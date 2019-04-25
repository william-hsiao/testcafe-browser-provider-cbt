const request = require('request-promise');

export async function fetchCBTBrowsers() {
  return request({
    uri: 'http://crossbrowsertesting.com/api/v3/selenium/browsers',
    json: true,
    transform: (body, response, resolveWithFullResponse) => {
      const browserList = [];
  
      body.forEach(item => {
        item.browsers.forEach(browser => {
          if (item.device === 'mobile') {
            browserList.push(`Mobile ${browser.caps.browserName}@${item.caps.platformVersion}:${item.caps.deviceName}`);
          } else {
            browserList.push(`${browser.caps.browserName}@${browser.caps.version}:${item.caps.platform}`);
          }
        })
      })
  
      return browserList;
    }
  });
}
