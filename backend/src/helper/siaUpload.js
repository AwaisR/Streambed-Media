const { SkynetClient } = require("@nebulous/skynet");

// create a client

const client = new SkynetClient();
const uploadtoSia = async (path) => {
  const skylink = await client.uploadFile(path);
  console.log(`Upload successful, skylink: ${skylink}`);
  return skylink.split("//")[1];
};

module.exports = uploadtoSia;
