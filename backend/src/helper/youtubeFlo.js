const wallet = require("./Wallet");
// const { Modules } = require("js-oip");
const { Address, Networks } = require("oip-hdmw");
const fetch = require("node-fetch");
let basic = {
  descriptor:
    "ClwKB3AucHJvdG8SEm9pcFByb3RvLnRlbXBsYXRlcyI1CgFQEg0KBXRpdGxlGAEgASgJEhMKC2Rlc2NyaXB0aW9uGAIgASgJEgwKBHllYXIYAyABKBFiBnByb3RvMw==",
  name: "tmpl_66089C48",
  payload: {
    title: "",
    description: "",
    year: 2020,
  },
};

let iterativeYTAssociation = {
  descriptor:
    "CkoKB3AucHJvdG8SEm9pcFByb3RvLnRlbXBsYXRlcyIjCgFQEgsKA3VybBgBIAEoCRIRCgl5b3VUdWJlSWQYAiABKAliBnByb3RvMw==",
  name: "tmpl_834772F4",
  payload: {
    url: "youtubevideolink",
    youTubeId: "",
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
const youtubeWallet = (obj, token) => {
  try {
    const sendToWallet = new Promise((resolve, reject) => {
      const upDatePayloads = (data) => {
        const youTubeData = data;
        basic.payload.title = youTubeData.snippet.title;
        basic.payload.description = youTubeData.snippet.description;
        iterativeYTAssociation.payload.url =
          "https://www.youtube.com/watch?v=" + youTubeData.id;
        iterativeYTAssociation.payload.youTubeId = youTubeData.id;
        basicVideoTmpl.payload.displayName =
          youTubeData.snippet.title + youTubeData.ext;
        basicVideoTmpl.payload.filename = "video" + youTubeData.ext;

        let registration = [basic, iterativeYTAssociation, basicVideoTmpl];
        return registration;
      };

      // const walletData = (youtubeResults) => {
      //   if (youtubeResults.err) return;

      //   const { createRegistration, publishRecord } = wallet;
      //   let registration = upDatePayloads(youtubeResults);
      //   const sendToBlockChain = async (signed64) => {
      //     if (signed64.length > 1040) {
      //       let mpx = new Modules.MultipartX(signed64).multiparts;

      //       if (!Array.isArray(mpx)) {
      //         return console.log("uh oh", mpx);
      //       }
      //       await getTxid(mpx, youtubeResults.id);
      //     } else {
      //       await getTxid(signed64, youtubeResults.id);
      //     }
      //   };
      //   createRegistration(registration, obj.userAddress)
      //     .then((data) => {
      //       return publishRecord(data);
      //     })
      //     .then((signed64) => {
      //       sendToBlockChain(signed64).then((res) => {
      //         console.log("Sent to flo");
      //       });
      //     })
      //     .catch((err) => {
      //       console.log("WalletData createRegistration error" + err);
      //       reject("error");
      //     });
      // };

      const sendMulti = async (mpx, post_id) => {
        // send address in req.body
        let mywif = obj.userAddress;

        var myMainAddress = new Address(mywif, Networks.flo);
        let floDataArr = [];

        const sendFloPost = async (floData, post_id) => {
          const response = await fetch(
            `${process.env.APP_URL_build}api/flo/sendFlo`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: token,
              },
              body: JSON.stringify({
                signed64: floData,
                postID: post_id,
              }),
            }
          );
          const json = await response.json();
          resolve(json.txid);

          return json;
        };
        // Signed64 is less than 1040
        if (!Array.isArray(mpx)) {
          let txid = await sendFloPost(mpx, post_id);
          floDataArr.push("txid", txid);
        } else {
          mpx[0].setAddress(myMainAddress.getPublicAddress());
          let sig = myMainAddress.signMessage(mpx[0].getSignatureData());
          mpx[0].setSignature(sig);

          let floData1 = mpx[0].toString();
          let referenceTxid = await sendFloPost(floData1, post_id);
          //First post request has come back ok, start the loop post request
          if (referenceTxid) {
            for (let i = 1; i < mpx.length; i++) {
              mpx[i].setReference(referenceTxid.txid);
              mpx[i].setAddress(myMainAddress.getPublicAddress());
              let sig = myMainAddress.signMessage(mpx[i].getSignatureData());
              mpx[i].setSignature(sig);
              let floDataX = mpx[i].toString();
              let txid = await sendFloPost(floDataX, post_id);

              floDataArr.push(txid);
            }
          }
        }
        return floDataArr;
      };
      const getTxid = async (mpx, post_id) => {
        await sendMulti(mpx, post_id)
          .then((txidArray) => {
            console.log("txidArray", txidArray);
          })
          .catch((err) => "Multipart Error: " + err);
      };
      walletData(obj.youTubeData);
    });

    return sendToWallet
      .then((msg) => {
        console.log("msg", msg);
        return msg;
      })
      .catch((err) => console.log("error", err));
  } catch (error) {
    console.log("something went wrong", error);
  }
};

module.exports = youtubeWallet;
