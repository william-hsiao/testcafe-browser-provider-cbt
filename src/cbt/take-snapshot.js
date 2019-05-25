const request = require('request-promise');

export async function takeSnapshot(id) {
  return request({
    method: 'POST',
    uri: `https://crossbrowsertesting.com/api/v3/selenium/${id}/snapshots`,
    auth: {
      user: process.env.CBT_USERNAME,
      pass: process.env.CBT_AUTHKEY,
    },
  });
}
