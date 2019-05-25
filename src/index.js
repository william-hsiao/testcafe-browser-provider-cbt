import { launchBrowser, resizeWindow } from './cbt/browsers';
import { fetchCBTBrowsers } from './cbt/fetch-browsers';
import {
  generateTunnelName,
  getTunnel,
  openTunnel,
  closeTunnel,
} from './cbt/tunnels';
import { setScore } from './cbt/set-score';
import { takeSnapshot } from './cbt/take-snapshot';

export default {
  availableBrowserNames: [],
  openedBrowsers: {},
  openedBrowsersId: {},
  launchedTunnel: false,
  isMultiBrowser: true,

  async openBrowser(id, pageUrl, browserName) {
    if (!process.env.CBT_TUNNEL_NAME) await generateTunnelName();

    const tunnel = await getTunnel();

    if (!tunnel) {
      this.launchedTunnel = true;

      openTunnel(() => {
        launchBrowser(id, pageUrl, browserName, this);
      });
    } else {
      launchBrowser(id, pageUrl, browserName, this);
    }
  },

  async closeBrowser(id) {
    await this.openedBrowsers[id].quit();

    delete this.openedBrowsers[id];
    delete this.openedBrowsersId[id];
  },

  async init() {
    if (!(process.env.CBT_USERNAME && process.env.CBT_AUTHKEY)) {
      throw new Error(
        'Authentication Failed: Please set CBT_USERNAME and CBT_AUTHKEY'
      );
    }

    this.availableBrowserNames = await fetchCBTBrowsers();
  },

  async dispose() {
    if (this.launchedTunnel) {
      if (!process.env.CBT_TUNNEL_NAME) return;

      await closeTunnel();
    }
  },

  async getBrowserList() {
    return this.availableBrowserNames;
  },

  async isValidBrowserName(browserName) {
    return this.availableBrowserNames.includes(browserName);
  },

  async resizeWindow(id, width, height) {
    await resizeWindow(this.openedBrowsers[id], width, height);
  },

  async takeScreenshot(id) {
    await takeSnapshot(this.openedBrowsersId[id]);
  },

  async reportJobResult(id, jobResult, jobData) {
    if (jobData.total === jobData.passed)
      setScore(this.openedBrowsersId[id], 'pass');
    else setScore(this.openedBrowsersId[id], 'fail');
  }
};
