/* eslint-disable */
import cbtTunnels from 'cbt_tunnels';
import webdriver from 'selenium-webdriver';
import { cbtCapabilities } from './browser-capabilities';
import { fetchCBTBrowsers } from './browser-list';
import { tunnelOptions } from './tunnel-options';
import { setScore } from './set-score';

const cbtHub = 'http://hub.crossbrowsertesting.com:80/wd/hub';

export default {
  openedBrowsers: {},
  openedBrowsersId: {},
  availableBrowserNames: [],

  // Multiple browsers support
  isMultiBrowser: true,

  // Required - must be implemented
  // Browser control
  async openBrowser(id, pageUrl, browserName) {
    console.log('Opening Browser');
    const cbtUsername = process.env.CBT_USERNAME;
    const cbtAuthKey = process.env.CBT_AUTHKEY;

    // console.log(id);

    const connectionConfig = {
      username: cbtUsername,
      authkey: cbtAuthKey,
      tunnelName: `testcafe_run_${id}`,
    };

    cbtTunnels.start(tunnelOptions(connectionConfig), async (err) => {
      if (err) throw new Error(err);

      const capabilities = cbtCapabilities(id, browserName, connectionConfig);

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
    });
  },

  async closeBrowser(id) {
    console.log('Closing Browser');
    console.log(this.openedBrowsers);
    await this.openedBrowsers[id].quit();
    cbtTunnels.stop();
    setScore(this.openedBrowsersId[id], 'pass', {
      username: process.env.CBT_USERNAME,
      authkey: process.env.CBT_AUTHKEY,
    });

    delete this.openedBrowsers[id];
    delete this.openedBrowsersId[id];
  },

  // Optional - implement methods you need, remove other methods
  // Initialization
  async init() {
    if (!(process.env.CBT_USERNAME && process.env.CBT_AUTHKEY)) {
      throw new Error('Authentication Failed: Please set CBT_USERNAME and CBT_AUTHKEY');
    }

    this.availableBrowserNames = await fetchCBTBrowsers();
  },

  async dispose() {
    return;
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
};
