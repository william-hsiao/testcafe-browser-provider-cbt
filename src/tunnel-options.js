export const tunnelOptions = params => {
  // TODO: Merge with config file
  return {
    username: params.username,
    authkey:  params.authkey,
    tunnelname: params.tunnelName,
  }
};
