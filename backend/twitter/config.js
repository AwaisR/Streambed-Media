require("dotenv").config();

const basicConfig = {
  subdomain: "api", // "api" is the default (change for other subdomains)
  version: "1.1", // version "1.1" is the default (change for other subdomains)
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET, // from Twitter.
};
// TODO! env
module.exports = basicConfig;
