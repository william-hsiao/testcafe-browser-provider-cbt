import cbtTunnels from 'cbt_tunnels';
import webdriver from 'selenium-webdriver';
import { cbtCapabilities } from './browser-capabilities';
import { fetchCBTBrowsers } from './browser-list';

const cbtHub = "http://hub.crossbrowsertesting.com:80/wd/hub";

const cbtUsername = process.env.CBT_USERNAME;
const cbtAuthKey = process.env.CBT_AUTHKEY;


const cbtTunnelOptions = {
  username: cbtUsername,
  authkey:  cbtAuthKey,

  tunnelname: '',
};

export default {
  openedBrowsers: {},
  availableBrowserNames: [],

  // Multiple browsers support
  isMultiBrowser: true,

  // Required - must be implemented
  // Browser control
  async openBrowser(/* id, pageUrl, browserName */) {
    // cbtTunnels.start(cbtOptions, err => {});
    try {
      let browser = new webdriver.Builder().usingServer(cbtHub).withCapabilities()
    }
    throw new Error('Not implemented!');
  },

  async closeBrowser(/* id */) {
    throw new Error('Not implemented!');
  },

  // Optional - implement methods you need, remove other methods
  // Initialization
  async init() {
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
  }
};
