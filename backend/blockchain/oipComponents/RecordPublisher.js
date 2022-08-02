/* eslint-disable no-unused-vars */
//import React from 'react';
const RecordCompiler = require("./RecordCompiler.js");
// const Modules = require( 'oip-protobufjs');
// const OipJs = require("js-oip");
const { config } = require("../oip.config.js");

const Wallet = require("../helpers/OipWallet.js");

class RecordPublisher {
  onError(err) {
    throw new Error(err);
  }

  async broadcast(msg, wif) {
    const explorerUrl = `${config.floExplorer}/api`;
    const oip = new OipJs.OIP(wif, "mainnet", { oipURL: explorerUrl });
    const myWallet = oip.wallet;
    let res;
    if (msg.length > 1040) {
      try {
        res = await oip.publishMultiparts(msg);
      } catch (err) {
        console.log("Error encountered: " + err);
      }
    } else {
      try {
        res = await myWallet.sendDataToChain(msg);
      } catch (err) {
        console.log("Error encountered: " + err);
      }
    }
    return res;
  }
}

module.exports = RecordPublisher;
