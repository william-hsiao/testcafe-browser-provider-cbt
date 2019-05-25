const cbtTunnels = require('cbt_tunnels');
const request = require('request-promise');
const shortid = require('shortid');
const fs = require('fs');

export function generateTunnelName() {
  process.env.CBT_TUNNEL_NAME = `testcafe-${shortid.generate()}`;
}

export async function getTunnel() {
  return request({
    method: 'GET',
    uri: 'https://crossbrowsertesting.com/api/v3/tunnels?active=true',
    auth: {
      user: process.env.CBT_USERNAME,
      pass: process.env.CBT_AUTHKEY
    },
    json: true,
    transform: data => {
      return data.tunnels.find(
        _tunnel => _tunnel.tunnel_name === process.env.CBT_TUNNEL_NAME
      );
    }
  });
}

export async function getTunnelID() {
  return request({
    method: 'GET',
    uri: 'https://crossbrowsertesting.com/api/v3/tunnels?active=true',
    auth: {
      user: process.env.CBT_USERNAME,
      pass: process.env.CBT_AUTHKEY
    },
    json: true,
    transform: body => {
      const tunnel = body.tunnels.find(
        _tunnel => _tunnel.tunnel_name === process.env.CBT_TUNNEL_NAME
      );

      return tunnel ? tunnel.tunnel_id : null;
    }
  });
}

export async function openTunnel(callback) {
  let importedConfig = {};
  if (process.env.CBT_TUNNEL_CONFIG_PATH) {
    try {
      const raw = fs.readFileSync(process.env.CBT_TUNNEL_CONFIG_PATH);
      importedConfig = JSON.parse(raw);
    } catch (e) {
      // importedConfig = {};
    }
  }

  await cbtTunnels.start(Object.assign(
    importedConfig,
    {
      username: process.env.CBT_USERNAME,
      authkey: process.env.CBT_AUTHKEY,
      tunnelname: process.env.CBT_TUNNEL_NAME
    }
  ),
    err => {
      if (err) throw new Error(err);
      callback();
    }
  );
}

export async function closeTunnel() {
  const tunnelID = await getTunnelID();

  if (tunnelID) {
    await request({
      method: 'DELETE',
      uri: `https://crossbrowsertesting.com/api/v3/tunnels/${tunnelID}`,
      auth: {
        user: process.env.CBT_USERNAME,
        pass: process.env.CBT_AUTHKEY
      },
      json: true
    });
  }
}
