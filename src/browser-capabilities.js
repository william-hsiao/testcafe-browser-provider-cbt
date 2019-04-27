/* eslint-disable camelcase */

// Accepted Timezones: https://help.crossbrowsertesting.com/selenium-testing/resources/list-of-timezones/
const timezones = [
  'GMT',
  'GMT-01:00',
  'GMT-02:00',
  'GMT-03:00',
  'GMT-03:30',
  'GMT-04:00',
  'GMT-05:00',
  'GMT-06:00',
  'GMT-07:00',
  'GMT-08:00',
  'GMT-09:00',
  'GMT-10:00',
  'GMT-11:00',
  'GMT-12:00',
  'GMT+01:00',
  'GMT+02:00',
  'GMT+03:00',
  'GMT+03:30',
  'GMT+04:00',
  'GMT+04:30',
  'GMT+05:00',
  'GMT+05:30',
  'GMT+05:45',
  'GMT+06:00',
  'GMT+06:30',
  'GMT+07:00',
  'GMT+08:00',
  'GMT+09:00',
  'GMT+09:30',
  'GMT+10:00',
  'GMT+11:00',
  'GMT+12:00',
  'GMT+13:00',
];

// List of available capabilities: https://help.crossbrowsertesting.com/selenium-testing/getting-started/crossbrowsertesting-automation-capabilities/
export const cbtCapabilities = (id, browserString, connectionConfig) => {
  const [, browserName, version, platform] = /([A-z0-9._ -]*)@([A-z0-9._ -]*):([A-z0-9._ -]*)/g.exec(browserString);
  
  let capabilities = {
    name: process.env.CBT_RUN_NAME || `Testcafe #${id}`,
    username: connectionConfig.username,
    password: connectionConfig.authkey,
    tunnel_name: connectionConfig.tunnelName,
  };

  // Mobile Chrome@6.0:Nexus 9
  if (browserName.includes('Mobile')) {
    capabilities = Object.assign(capabilities, {
      browserName: browserName.slice(7),
      platformVersion: version,
      deviceName: platform,
    });
  } else {
    capabilities = Object.assign(capabilities, {
      browserName,
      version,
      platform,
    });
  }

  if (process.env.CBT_RECORD_VIDEO === 'true') {
    capabilities = Object.assign(capabilities, {
      record_video: true
    });
  }

  if (process.env.CBT_RECORD_NETWORK === 'true') {
    capabilities = Object.assign(capabilities, {
      record_network: true
    });
  }

  if (typeof parseInt(process.env.CBT_MAX_DURATION, 10) === 'number') {
    capabilities = Object.assign(capabilities, {
      max_duration: parseInt(process.env.CBT_MAX_DURATION, 10)
    });
  }

  if (timezones.includes(process.env.CBT_TIMEZONE)) {
    capabilities = Object.assign(capabilities, {
      timezone: process.env.CBT_TIMEZONE
    });
  }

  return capabilities;
};
