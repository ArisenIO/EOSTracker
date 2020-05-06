// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: true,
  walletUrl: 'https://github.com/arisenio/avote/releases',
  votingUrl: 'https://github.com/arisenio/avote/releases',
  appName: 'Arisen Network Explorer',
  logoUrl: '/assets/logo.png',
  blockchainUrl: 'https://greatchains.arisennodes.io',
  chainId: '136ce1b8190928711b8bb50fcae6c22fb620fd2c340d760873cf8f7ec3aba2b3',
  showAds: false,
  SHOW_ADS: true,        // include after fork
  tokensUrl: 'https://raw.githubusercontent.com/rixcafe/rix-airdrops/master/tokens.json',
  tickerUrl: 'https://nv6khovry9.execute-api.us-east-1.amazonaws.com/dev/rsn_price_from_bts',
  token: 'RIX'
};
