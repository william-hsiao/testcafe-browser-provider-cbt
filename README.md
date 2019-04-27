# testcafe-browser-provider-crossbrowsertesting
[![Build Status](https://travis-ci.org/william-hsiao/testcafe-browser-provider-crossbrowsertesting.svg)](https://travis-ci.org/william-hsiao/testcafe-browser-provider-crossbrowsertesting)

This is the **crossbrowsertesting** browser provider plugin for [TestCafe](http://devexpress.github.io/testcafe).

## Install

```
npm install testcafe-browser-provider-cross-browser-testing
```

## Usage

Before using this plugin, please set your username/email address and authentication key to their respective environment variables `CBT_USERNAME` and `CBT_AUTHKEY`.

```
export CBT_USERNAME=/* Your CrossBrowserTesting Username */
export CBT_AUTHKEY=/* Your CrossBrowserTesting Authkey */
```

You can determine the available browser aliases by running
```
testcafe -b cross-browser-testing
```

When you run tests from the command line, use the alias when specifying browsers:

```
testcafe "cross-browser-testing:Chrome@73:Windows 10" 'path/to/test/file.js'
```


When you use API, pass the alias to the `browsers()` method:

```js
testCafe
    .createRunner()
    .src('path/to/test/file.js')
    .browsers('cross-browser-testing:Chrome@73:Windows 10')
    .run();
```

## Author
William Hsiao 
