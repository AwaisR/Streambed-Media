const { Wallet, Account, Networks } = require('@oipwg/hdmw')
const { recordProtoBuilder, buildOipDetails } = require('oip-protobufjs')
const { sendFlo } = require('./sendFlo')
const OipWallet = require('./helpers/OipWallet');

const { config } = require('./oip.config');

let main = async () => {
  // Create Wallet
  const myWallet = new Wallet('', {supported_coins: ['flo'], discover: false});
  const mnemonic = myWallet.getMnemonic()
  console.log(`My Mnemonic: '${myWallet.getMnemonic()}'`)

  // Grab the Account
  const flo = myWallet.getCoin('flo')
  const paymentRecieverAccount = flo.getAccount(0)
  const EXTERNAL_CHAIN = 0
  const wif = paymentRecieverAccount.getAddress(EXTERNAL_CHAIN, 0).getPrivateAddress()
  console.log(wif)

  // Use OIP template 
  const descriptor = 'CogBCgdwLnByb3RvEhJvaXBQcm90by50ZW1wbGF0ZXMiJwoBUBIQCgRtYXNzGAEoA1IEbWFzcxIQCgRuYW1lGAIoCVIEbmFtZUpACgUSAwAAAAoICgEMEgMAAAAKCAoBAhIDAAAACgkKAgQAEgMAAAAKCwoEBAACABIDAAAACgsKBAQAAgESAwAAAA=='
  const name = 'tmpl_370840EECB3C27CA'
  const payload = {
    name: 'Bitcoin max supply',
    mass: 21000000
  }
  const details = buildOipDetails({descriptor, name, payload})
  const record = recordProtoBuilder({
    details,
    wif,
    network: 'mainnet',
  })
  console.log(record.signedMessage64)

  // Send to blockchain
  sendFlo("p64:"+record.signedMessage64)

}

main()