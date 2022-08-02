//import React from 'react';
const { config } = require("../oip.config.js");
const wallet = require("../helpers/OipWallet.js");
// const Oip = require("oip-protobufjs");

let basic = {
  descriptor:
    "ClwKB3AucHJvdG8SEm9pcFByb3RvLnRlbXBsYXRlcyI1CgFQEg0KBXRpdGxlGAEgASgJEhMKC2Rlc2NyaXB0aW9uGAIgASgJEgwKBHllYXIYAyABKBFiBnByb3RvMw==",
  name: "tmpl_66089C48",
  payload: {
    title: "Title",
    description: "Description",
    year: 2020,
  },
};

let iterativeYTAssociation = {
  descriptor:
    "CkoKB3AucHJvdG8SEm9pcFByb3RvLnRlbXBsYXRlcyIjCgFQEgsKA3VybBgBIAEoCRIRCgl5b3VUdWJlSWQYAiABKAliBnByb3RvMw==",
  name: "tmpl_834772F4",
  payload: {
    url: "youtubevideolink",
    youTubeId: "youtubeId",
    contentPlatform: 1, // ContentPlatform_YOUTUBE
  },
};

let basicVideoTmpl = {
  descriptor:
    "CuABCgdwLnByb3RvEhJvaXBQcm90by50ZW1wbGF0ZXMiuAEKAVASEwoLcHVibGlzaERhdGUYASABKAQSGAoQYWRkcmVzc0RpcmVjdG9yeRgDIAEoCRIQCghmaWxlbmFtZRgEIAEoCRITCgtkaXNwbGF5TmFtZRgFIAEoCRIZChF0aHVtYm5haWxGaWxlbmFtZRgGIAEoCSJCCgdOZXR3b3JrEg0KCVVOREVGSU5FRBAAEhAKDE5ldHdvcmtfSVBGUxABEhYKEk5ldHdvcmtfQklUVE9SUkVOVBACYgZwcm90bzM=",
  name: "tmpl_5D503849",
  payload: {
    publishDate: Date.now(),
    addressDirectory: "ipfsHASH",
    filename: "",
    displayName: "",
    thumbnailFilename: "thumb.png",
    network: 1, // Network_IPFS
  },
};

class RecordCompiler {
  /*
    state = {
        loader: false,
        results: null,
        checkbox: {},
        checkBoxErr: false
    };
    */
  // 2
  // async encodeRecord(data) {
  //   try {
  //     const details = Oip.buildOipDetails(data);
  //     const wif = config.myMainAddress;

  //     const { signedMessage64 } = await Oip.recordProtoBuilder({
  //       details,
  //       wif,
  //       network: "mainnet",
  //     });

  //     //console.log('signedMessage64 ', 'p64:' + signedMessage64);

  //     return "p64:" + signedMessage64;
  //   } catch (err) {
  //     return "Failed at publishRecord: " + err;
  //   }
  // }

  upDatePayload(obj) {
    console.log("obj", obj);

    const { title, description, url, youTubeId, displayName, filename } = obj;

    //const youTubeData = this.state.results;
    const youTubeData = config.youtubeTmpls;

    //If IPFS is not running empty payload else add the ipfs hash
    //let ipfs = this.isIPFSerror(youTubeData.ipfs) ? '' : youTubeData.ipfs;

    basic.payload.title = title;
    basic.payload.description = description;
    iterativeYTAssociation.payload.url = url;
    iterativeYTAssociation.payload.youTubeId = youTubeId;
    basicVideoTmpl.payload.displayName = displayName;
    // basicVideoTmpl.payload.filename = youTubeData.basicVideo.payload.filename;
    //basicVideoTmpl.payload.addressDirectory = ipfs;

    let registration = [basic, iterativeYTAssociation, basicVideoTmpl];
    return registration;
  }

  walletData(youtubeResults) {
    if (youtubeResults.err) return;

    const { createRegistration, publishRecord } = wallet;
    let registration = this.upDatePayloads();

    createRegistration(registration)
      .then((data) => {
        console.log(data);
        return publishRecord(data);
      })
      .then((signed64) => {
        console.log(signed64);
        this.sendToBlockChain(signed64).then((res) =>
          console.log("Sent to flo")
        );
      })
      .catch((err) => console.log("WalletData " + err));
  }

  /*
    getYouTubeData() {
      const checkbox = this.state['checkbox'];
  
      fetch('/upload-youtube', {
        method: 'POST',
        body: JSON.stringify(checkbox),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then((res) => res.json())
        .then((data) => {
          this.setState({ results: data, loader: false }, () =>
            this.walletData(this.state.results)
          );
        })
        .catch((err) => console.log(err));
    };
    */

  async getTxid(mpx) {
    await this.sendMulti(mpx)
      .then((txidArray) => {
        console.log(txidArray);
      })
      .catch((err) => "Multipart Error: " + err);
  }

  isIPFSerror(youTubeData) {
    return /^IPFS failed:/gi.test(youTubeData);
  }
}

module.exports = RecordCompiler;
