const HDMW = require("oip-hdmw");
//import { buildOipDetails, recordProtoBuilder } from 'oip-protobufjs';
const Wallet = HDMW.Wallet;

class OipWallet {
  constructor(mnemonic) {
    this.myWallet = new Wallet(mnemonic, {
      supported_coins: ["flo"],
      discover: false,
    });
    //this.createMnemonic = this.createMnemonic.bind(this);
    //this.createRegistration = this.createRegistration.bind(this);
  }

  getMyMnemonic() {
    try {
      let myMnemonic = this.myWallet.getMnemonic();
      return myMnemonic;
    } catch (error) {
      console.log("something went wrong", error);
    }
  }

  async createMnemonic() {
    try {
      let mnemonic = await this.myWallet.getMnemonic();
      return mnemonic;
    } catch (error) {
      console.log("something went wrong", error);
    }
  }
}

module.exports = OipWallet;
