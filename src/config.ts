export const config = {
  SENDGRID_API_KEY: "TODO...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",
  DOMAIN: "https://www.pocketbarcelona.com",
  BRAND_NAME: "Pocket Barcelona",
  EMAIL_NOREPLY: "noreply@pocketbarcelona.com",

  port: 3002,
  saltWorkFactor: 10,
  
  // the session token validity time in minutes - must be a number
  accessTokenTtl: 15,
  // the refresh token validity time in minutes - must be a number (60 * 24 * 365)
  refreshTokenTtl: 525600,

  // salt used for new user confirming their email addresses from the welcome email - changing this invalidates welcome email confirm links
  confirmNewUserSalt: 'S@LTYC0FFE3ANDT3A!',

  // NOTE: this key should only be exposed server side. This can be used to generate JWT's for the backend system!
  // NOTE: Do not tab indent this line!
accessTokenPrivateKey: `-----BEGIN RSA PRIVATE KEY-----
[AWS CONFIG VAR]MII
l1hMg==
-----END RSA PRIVATE KEY-----`,
// Do not tab indent this line!
accessTokenPublicKey: `-----BEGIN PUBLIC KEY-----
[AWS CONFIG VAR]MIGfM
IDAQAB
-----END PUBLIC KEY-----`,
refreshTokenPrivateKey: `-----BEGIN RSA PRIVATE KEY-----
[AWS CONFIG VAR]MIIC
bUl1hMg==
-----END RSA PRIVATE KEY-----`,
refreshTokenPublicKey: `-----BEGIN PUBLIC KEY-----
[AWS CONFIG VAR]MIGfM
QIDAQAB
-----END PUBLIC KEY-----`,
  /** The name of the header which holds the Bearer access token */
  HEADER_AUTHORIZATION: 'Authorization',
  /** The name of the header which holds the refresh token */
  HEADER_X_REFRESH_TOKEN: 'X-Refresh',
  /** The name of the header prompting the frontend interceptor to update its stale access token */
  HEADER_X_ACCESS_TOKEN: 'X-Access-Token',

} as const;
