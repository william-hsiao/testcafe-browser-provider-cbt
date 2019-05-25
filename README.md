# testcafe-browser-provider-cbt

[![Build Status](https://travis-ci.org/william-hsiao/testcafe-browser-provider-cbt.svg)](https://travis-ci.org/william-hsiao/testcafe-browser-provider-cbt)

This is the **CrossBrowserTesting** browser provider plugin for [TestCafe](http://devexpress.github.io/testcafe).

Features:

- Posts results back to CBT
- Opens a local connection to CBT Browsers
- CBT Browser & Tunnel configuration

## Install

```
npm install testcafe-browser-provider-cbt
```

## Usage

Before using this plugin, please set your username/email address and authentication key to their respective environment variables `CBT_USERNAME` and `CBT_AUTHKEY`.

```
export CBT_USERNAME=/* Your CrossBrowserTesting Username */
export CBT_AUTHKEY=/* Your CrossBrowserTesting Authkey */
```

You can determine the available browser aliases by running

```
testcafe -b cbt
```

When you run tests from the command line, use the alias when specifying browsers:

```
testcafe "cbt:Chrome@73:Windows 10" 'path/to/test/file.js'
```

When you use API, pass the alias to the `browsers()` method:

```js
testCafe
  .createRunner()
  .src('path/to/test/file.js')
  .browsers('cbt:Chrome@73:Windows 10')
  .run();
```

# Local Server Testing

This plugin automatically opens a local connection to CBT using named [cbt_tunnels](). This allows you run multiple tests with different builds at the same time without interfering with each other. The connection will automatically close at the end of the test.

If you already have a CBT Tunnel conneciton open that you would like to use, make sure you initialize it with a tunnel name and store the name in the environment variable `CBT_TUNNEL_NAME`. After the test ends, it will NOT close your connection.

# Configuration

It is possible to set custom configurations for the CBT Browser instance as well as the tunnel

### CBT Browser

You can set the browser capabilities by creating a JSON file and store the filepath in the environment variable `CBT_BROWSER_CONFIG_PATH`.

You can find the full list of capabilities at: https://help.crossbrowsertesting.com/selenium-testing/getting-started/crossbrowsertesting-automation-capabilities/

### CBT Tunnels

You can set addtional settings for the CBT Tunnel by creating a JSON file and store the filepath in the environment variable `CBT_TUNNEL_CONFIG_PATH`.

You can find the full list of options at: https://github.com/crossbrowsertesting/cbt-tunnel-nodejs

# Taking Snapshots

You can take a snapshot of the CBT session by using the Testcafe `takeScreenshot()` method. Currently, the screenshot is not saved locally.
When starting Testcafe, please set an arbitrary screenshot filepath such as `-s './'` if you are using the command line or `runner.screenshots('./');` if you are using the programming interface.

## Author

William Hsiao
