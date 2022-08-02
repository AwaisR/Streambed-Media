const OipWallet = require("./helpers/OipWallet.js");
const RecordCompiler = require("./oipComponents/RecordCompiler.js");
const RecordPublisher = require("./oipComponents/RecordPublisher.js");
const { sendFlo } = require("./oipComponents/SendFlo");

const { config } = require("./oip.config.js");

let myWif = "RFxV2tPTwCGH9jWgrx7hcwHPm4h8q8DJoQEe8yE5CsSs4bXrMZkB";
let myMnemonic =
  "report supreme settle text whale math couple select follow tornado assist fit";

let myWallet = new OipWallet(myMnemonic);
//console.log("My Menmonic is: " + myWallet.getMnemonic())

let recordCompiler = new RecordCompiler();
let recordPublisher = new RecordPublisher();

async function compileMessage(youtube) {
  let updatedPayload = recordCompiler.upDatePayload(youtube);
  let signedMessage = await recordCompiler.encodeRecord(updatedPayload);
  let message = signedMessage.toString();

  return message;
}

async function postToBlockchain(youtube) {
  //console.log("test 1: " + await compileMessage())
  await sendFlo(await compileMessage(youtube));
}

async function sendToBlockChain(youtube) {
  postToBlockchain(youtube);
}

module.exports = { sendToBlockChain };
