const request = require('request-promise');

export async function setScore(id, score, auth) {
  if (!id) return;

  request({
    method: 'PUT',
    uri: 'https://crossbrowsertesting.com/api/v3/selenium/' + id,
    body: { action: 'set_score', score: score },
    json: true
  }).auth(auth.username, auth.authkey);
}
