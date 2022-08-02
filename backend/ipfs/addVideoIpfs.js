const ipfsClient = require("ipfs-http-client");
const fs = require("fs");

const ipfs = new ipfsClient({
  host: "localhost",
  port: "5001",
  protocol: "http",
});

class Ipfs {
  async addFile(videoInfo) {
    try {
      const video = fs.createReadStream(videoInfo.videoFilePath);
      const thumb = fs.createReadStream(videoInfo.imgFilePath);

      // const fileAdded = await ipfs.add({path: filename, content: file})
      const fileAdded = await ipfs.add(
        [
          {
            path: videoInfo.videoFileName,
            content: video,
          },
          {
            path: videoInfo.imgFileName,
            content: thumb,
          },
        ],
        { pin: true, wrapWithDirectory: true }
      );

      // hash for uploads folder of files
      const fileHash = fileAdded[2].hash;
      return fileHash;
    } catch (e) {
      console.log("something went wrong", e);
      return "IPFS failed: " + e;
    }
  }
}

module.exports = new Ipfs();
