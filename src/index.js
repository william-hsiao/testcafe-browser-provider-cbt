const webdriver = require('selenium-webdriver');
const request = require('request-promise');
const cbtTunnels = require('cbt_tunnels');
const shortid = require('shortid');

import { cbtCapabilities } from './browser-capabilities';

const cbtHub = 'http://hub.crossbrowsertesting.com:80/wd/hub';

export default {
  openedBrowsers: {},
  openedBrowsersId: {},
  availableBrowserNames: [],
  launchedTunnel: false,

  // Multiple browsers support
  isMultiBrowser: true,

  async _fetchCBTBrowsers() {
    return request({
      uri: 'http://crossbrowsertesting.com/api/v3/selenium/browsers',
      json: true,
      transform: (body) => {
        const browserList = [];
    
        body.forEach(item => {
          item.browsers.forEach(browser => {
            if (item.device === 'mobile') {
              browserList.push(`Mobile ${browser.caps.browserName}@${item.caps.platformVersion}:${item.caps.deviceName}`);
            } else {
              browserList.push(`${browser.caps.browserName}@${browser.caps.version}:${item.caps.platform}`);
            }
          });
        });
    
        return browserList;
      }
    });
  },

  async _launchBrowser(id, pageUrl, browserName) {
    const capabilities = cbtCapabilities(id, browserName);

    try {
      const browser = new webdriver.Builder()
        .usingServer(cbtHub)
        .withCapabilities(capabilities)
        .build();

      await browser.getSession().then(session => {
        this.openedBrowsersId[id] = session.id_;
      });

      await browser.get(pageUrl);

      this.openedBrowsers[id] = browser;
    } catch (error) {
      throw new Error(error);
    }
  },

  async _getTunnelID() {
    if (!process.env.CBT_TUNNEL_NAME) return null;

    return request({
      method: 'GET',
      uri: 'https://crossbrowsertesting.com/api/v3/tunnels?active=true',
      auth: {
        user: process.env.CBT_USERNAME,
        pass: process.env.CBT_AUTHKEY,
      },
      json: true,
      transform: body => {
        const tunnel = body.tunnels.find(_tunnel => _tunnel.tunnel_name === process.env.CBT_TUNNEL_NAME);

        return tunnel ? tunnel.tunnel_id : null;
      }
    });
  },

  async _setScore(id, score) {
    if (!id) return;
  
    request({
      method: 'PUT',
      uri: 'https://crossbrowsertesting.com/api/v3/selenium/' + id,
      body: { action: 'set_score', score: score },
      auth: {
        user: process.env.CBT_USERNAME,
        pass: process.env.CBT_AUTHKEY,
      },
      json: true,
    });
  },

  // Required - must be implemented
  // Browser control
  async openBrowser(id, pageUrl, browserName) {
    if (!process.env.CBT_TUNNEL_NAME)
      process.env.CBT_TUNNEL_NAME = `testcafe-${shortid.generate()}`;
  
    request({
      method: 'GET',
      uri: 'https://crossbrowsertesting.com/api/v3/tunnels?active=true',
      auth: {
        user: process.env.CBT_USERNAME,
        pass: process.env.CBT_AUTHKEY,
      },
      json: true,
    }).then(async (res) => {
      const tunnel = res.tunnels.find(_tunnel => _tunnel.tunnel_name === process.env.CBT_TUNNEL_NAME);
  
      if (!tunnel) {
        this.launchedTunnel = true;
        await cbtTunnels.start({
          username: process.env.CBT_USERNAME,
          authkey: process.env.CBT_AUTHKEY,
          tunnelname: process.env.CBT_TUNNEL_NAME,
        }, err => {
          if (err) throw new Error(err);
          this._launchBrowser(id, pageUrl, browserName);
        });
      } else {
        this._launchBrowser(id, pageUrl, browserName);
      }
    });
  },

  async closeBrowser(id) {
    await this.openedBrowsers[id].quit();

    delete this.openedBrowsers[id];
    delete this.openedBrowsersId[id];
  },

  // Optional - implement methods you need, remove other methods
  // Initialization
  async init() {
    if (!(process.env.CBT_USERNAME && process.env.CBT_AUTHKEY)) {
      throw new Error('Authentication Failed: Please set CBT_USERNAME and CBT_AUTHKEY');
    }

    this.availableBrowserNames = await this._fetchCBTBrowsers();
  },

  async dispose() {
    if (this.launchedTunnel) {
      if (!process.env.CBT_TUNNEL_NAME) return;

      const tunnelID = await this._getTunnelID();

      if (tunnelID) {
        await request({
          method: 'DELETE',
          uri: `https://crossbrowsertesting.com/api/v3/tunnels/${tunnelID}`,
          auth: {
            user: process.env.CBT_USERNAME,
            pass: process.env.CBT_AUTHKEY,
          },
          json: true,
        });
      }
    }
  },

  // Browser names handling
  async getBrowserList() {
    return this.availableBrowserNames;
  },

  async isValidBrowserName(browserName) {
    return this.availableBrowserNames.includes(browserName);
  },

  // Extra methods
  async resizeWindow(/* id, width, height, currentWidth, currentHeight */) {
    this.reportWarning(
      'The window resize functionality is not supported by the "crossbrowsertesting" browser provider.'
    );
  },

  async takeScreenshot(/* id, screenshotPath, pageWidth, pageHeight */) {
    this.reportWarning(
      'The screenshot functionality is not supported by the "crossbrowsertesting" browser provider.'
    );
  },

  async reportJobResult(id, jobResult, jobData) {
    if (jobData.total === jobData.passed)
      this._setScore(this.openedBrowsersId[id], 'pass');
    else
      this._setScore(this.openedBrowsersId[id], 'fail');
  }
};
