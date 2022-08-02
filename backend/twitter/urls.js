const getRedirectUrl = (oauth_token, oauth_token_secret) =>
  `https://api.twitter.com/oauth/authenticate?oauth_token=${oauth_token}&oauth_token_secret=${oauth_token_secret}`;

module.exports = {
  getRedirectUrl,
};
