const request = require('request-promise');

export async function setScore(id, score) {
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
}
