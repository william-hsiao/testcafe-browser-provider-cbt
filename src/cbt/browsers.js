/* eslint-disable camelcase */
const webdriver = require('selenium-webdriver');
const fs = require('fs');

import { cbtHub, timezones } from './utils';

// List of available capabilities: https://help.crossbrowsertesting.com/selenium-testing/getting-started/crossbrowsertesting-automation-capabilities/
export const cbtCapabilities = (id, browserString) => {
  const [
    ,
    browserName,
    version,
    platform
  ] = /([A-z0-9._ -]*)@([A-z0-9._ -]*):([A-z0-9._ -]*)/g.exec(browserString);

  let importedConfig = {};

  if (process.env.CBT_BROWSER_CONFIG_PATH) {
    try {
      const raw = fs.readFileSync(process.env.CBT_BROWSER_CONFIG_PATH);
      importedConfig = JSON.parse(raw);
    } catch (e) {
      // importedConfig = {};
    }
  }

  const capabilities = Object.assign(importedConfig, {
    name: process.env.CBT_RUN_NAME || `Testcafe #${id}`,
    username: process.env.CBT_USERNAME,
    password: process.env.CBT_AUTHKEY,
    tunnel_name: process.env.CBT_TUNNEL_NAME
  });


  // Mobile Chrome@6.0:Nexus 9
  if (browserName.includes('Mobile')) {
    capabilities.browserName = browserName.slice(7);
    capabilities.platformVersion = version;
    capabilities.deviceName = platform;
  } else {
    capabilities.browserName = browserName;
    capabilities.version = version;
    capabilities.platform = platform;
  }

  if (process.env.CBT_RECORD_VIDEO === 'true') {
    capabilities.record_video = true;
  }

  if (process.env.CBT_RECORD_NETWORK === 'true') {
    capabilities.record_network = true;
  }

  if (typeof parseInt(process.env.CBT_MAX_DURATION, 10) === 'number') {
    try {
      capabilities.max_duration = parseInt(process.env.CBT_MAX_DURATION, 10);
    } catch (e) {
      // console.error(e);
    }
  }

  if (timezones.includes(process.env.CBT_TIMEZONE)) {
    capabilities.timezone = process.env.CBT_TIMEZONE;
  }

  return capabilities;
};

export async function launchBrowser(id, pageUrl, browserName, connector) {
  const capabilities = cbtCapabilities(id, browserName);

  try {
    const browser = new webdriver.Builder()
      .usingServer(cbtHub)
      .withCapabilities(capabilities)
      .build();

    await browser.getSession().then(session => {
      connector.openedBrowsersId[id] = session.id_;
    });

    await browser.get(pageUrl);

    connector.openedBrowsers[id] = browser;
  } catch (error) {
    throw new Error(error);
  }
}
